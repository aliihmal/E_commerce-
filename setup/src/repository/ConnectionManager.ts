import { Client } from "pg";
import config from "../config";
import logger from "../util/logger";

function toPgQuery(sql: string): string {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
}

class PgConnection {
    constructor(private client: Client) {}

    async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
        const res = await this.client.query(toPgQuery(sql), params);
        return res.rows[0] as T | undefined;
    }

    async all<T>(sql: string, params: any[] = []): Promise<T> {
        const res = await this.client.query(toPgQuery(sql), params);
        return res.rows as unknown as T;
    }

    async run(sql: string, params: any[] = []): Promise<void> {
        await this.client.query(toPgQuery(sql), params);
    }

    async exec(sql: string): Promise<void> {
        await this.client.query(sql);
    }
}

export class ConnectionManager {
    private static db: PgConnection | null = null;
    private static client: Client | null = null; 

    constructor() {}

    public static async getConnection(): Promise<PgConnection> {
        try {
            if (!this.db) {
                this.client = new Client({
                    connectionString: config.storagePath.postegress,
                    ssl: { rejectUnauthorized: false }, // Neon requires SSL
                });
                await this.client.connect();
                this.db = new PgConnection(this.client);
            }
            return this.db;
        } catch (error) {
            logger.error("Failed to connect to the database ", error as Error);
            throw new Error("Error while connecting to the database ");
        }
    }
}