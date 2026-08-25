import { userMapper, userRow } from "../mapper/user.mapper";
import { User } from "../model/user.model";
import { DBexception } from "../util/Exception/repoException";
import logger from "../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";

const CREATE_USER_TABLE =`CREATE TABLE IF NOT EXISTS "user"(
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    phone TEXT)`;

const ADD_USER =`INSERT INTO "user" (id,name,email,password,role,phone) VALUES (?,?,?,?,?,?)`;

const GET_USER_ID=`SELECT * FROM "user" WHERE id = ? `;

const GET_BY_EMAIL=`SELECT * FROM "user" WHERE email = ? `;
export class UserRepository implements Initializabel,IRpository<User>{
    async create(item: User): Promise<id> {
        try{
            const conn =await ConnectionManager.getConnection();
            await conn.run(ADD_USER,[item.id,item.name,item.email,item.password,item.role,item.phone]);
            logger.info("User was Created succssefully");
            return item.id;
        }catch(error){
            logger.error("Error while creating the user %s",(error as Error));
            throw new DBexception("Error while creating the user " ,(error as Error));
        }
    }

    
    async get(id: id): Promise<User> {
     try{
        const conn = await ConnectionManager.getConnection();
        const result = await conn.get<userRow>(GET_USER_ID,[id]);
        if(!result){
            throw new Error("Error while retrieving the user of the specific id ");
        }
        logger.info("The user of the specific id was retrieved succssefuly");
        const mapper = new userMapper();
        return mapper.map(result);
     }catch(error){
        logger.error("Error while retrieving the user of the specific id %s",(error as Error));
        throw new DBexception("Error while retrieving the user of the specific id ", (error as Error));
     }
    }

    async findByEmail(email:string):Promise<User>{
        try{
            const conn = await ConnectionManager.getConnection();
            const res = await conn.get<userRow>(GET_BY_EMAIL,[email]);
            console.log(res);
            if(res == null){
                throw new Error("user with email " + email + " is not found");
            }
            const mapper = new userMapper();
            return mapper.map(res);
        }catch(error){
            logger.error("Error while retrieving the user of the specific email %s" ,(error as Error ).message);
            throw new DBexception("Error while retrieving the user of the specific email",(error as Error));
        }
    }
    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
   async update(item: User): Promise<void> {
    try{ 
                const db = await ConnectionManager.getConnection();

            const query = `
                UPDATE "user"
                SET
                    name = ?,
                    email = ?,
                    password = ?,
                    phone = ?,
                    role = ?
                WHERE id = ?
            `;

            await db.run(query, [
                item.name,
                item.email,
                item.password,
                item.phone,
                item.role,
                item.id
            ]);
        }catch(error){
            logger.error("Error while updating the user %s",(error as Error).message);
            throw new DBexception("Error while updating the user " , (error as Error));
        }
}
    delete(id: id): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async init(): Promise<void> {
       try{
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_USER_TABLE);
            logger.info("The table user was created succsseefuly");
        }catch(error){
            logger.error("Error while creating the user table %s",(error as Error).message);
            throw new DBexception("Error while creating the user table",(error as Error));
        }
    }

    
    
}

export async function getUserRepo():Promise<UserRepository>{
    const repo = new UserRepository();
    await repo.init();
    return repo;
}