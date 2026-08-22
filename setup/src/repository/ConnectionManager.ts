import config from "../config"
import { Database as sqliteDatabase , open } from "sqlite";
import {Database ,Statement} from "sqlite3";
import logger from "../util/logger";
export class ConnectionManager{
    private static db :sqliteDatabase<Database,Statement> | null=null;
    constructor(){};
    public static async  getConnection ():Promise<sqliteDatabase<Database,Statement>>{
        try{
            if(!this.db){
                this.db = await open({
                    filename:config.storagePath.sqlite,
                    driver:Database,
                })
            }
            return this.db
        }catch(error){
             logger.error("Failed to connect to the database ",error as Error) ;
            throw new Error("Error while connecting to the database ");
        }
    }
}