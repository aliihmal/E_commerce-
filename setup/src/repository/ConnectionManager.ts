import { Pool, PoolClient } from "pg";
import config from "../config";
import logger from "../util/logger";

function toPgQuery(sql: string): string {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
}

// A query is retried once if it fails on a dropped/stale connection
// (e.g. Neon suspending an idle compute and killing the connection).
const RECOVERABLE_ERROR_CODES = new Set([
    "57P01", // admin_shutdown - "terminating connection due to administrator command"
    "57P02", // crash_shutdown
    "57P03", // cannot_connect_now
    "ECONNRESET",
    "ETIMEDOUT",
]);

function isRecoverable(error: any): boolean {
    return RECOVERABLE_ERROR_CODES.has(error?.code);
}

class PgConnection {
    constructor(private pool: Pool) {}

    private async withRetry<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        try {
            const client = await this.pool.connect();
            try {
                return await fn(client);
            } finally {
                client.release();
            }
        } catch (error) {
            if (isRecoverable(error)) {
                logger.warn("DB connection dropped, retrying once: %s", (error as Error).message);
                const client = await this.pool.connect();
                try {
                    return await fn(client);
                } finally {
                    client.release();
                }
            }
            throw error;
        }
    }

    async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
        return this.withRetry(async (client) => {
            const res = await client.query(toPgQuery(sql), params);
            return res.rows[0] as T | undefined;
        });
    }

    async all<T>(sql: string, params: any[] = []): Promise<T> {
        return this.withRetry(async (client) => {
            const res = await client.query(toPgQuery(sql), params);
            return res.rows as unknown as T;
        });
    }

    async run(sql: string, params: any[] = []): Promise<void> {
        await this.withRetry(async (client) => {
            await client.query(toPgQuery(sql), params);
        });
    }

    async exec(sql: string): Promise<void> {
        await this.withRetry(async (client) => {
            await client.query(sql);
        });
    }
}

export class ConnectionManager {
    private static db: PgConnection | null = null;
    private static pool: Pool | null = null;

    constructor() {}

    public static async getConnection(): Promise<PgConnection> {
        try {
            if (!this.db) {
                this.pool = new Pool({
                    connectionString: config.storagePath.postegress,
                    ssl: { rejectUnauthorized: false }, // Neon requires SSL
                    max: 10,                    // max clients in the pool
                    idleTimeoutMillis: 20000,   // recycle idle clients before Neon kills them
                    connectionTimeoutMillis: 10000,
                });
                // A pooled client can still be dropped server-side (e.g. Neon
                // suspend) while sitting idle. Log it instead of crashing the process.
                this.pool.on("error", (err) => {
                    logger.error("Unexpected error on idle DB client", err as Error);
                });
                this.db = new PgConnection(this.pool);
            }
            return this.db;
        } catch (error) {
            logger.error("Failed to connect to the database ", error as Error);
            throw new Error("Error while connecting to the database ");
        }
    }
}