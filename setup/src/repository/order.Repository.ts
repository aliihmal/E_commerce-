import { log } from "winston";
import { Order } from "../model/order.model";
import { DBexception } from "../util/Exception/repoException";
import logger from "../util/logger";
import { CartRepository } from "./cart.Repository";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";

const CREATE_TABLE =`CREATE TABLE IF NOT EXISTS "order"(
                         id TEXT PRIMARY KEY,
                         userId TEXT NOT NULL,
                         price INT NOT NULL)`;

const CREATE_ORDER =`INSERT INTO "order" (id,userId,price) VALUES (?,?,?)`;
export class orderRepository implements Initializabel,IRpository<Order>{

    constructor(private cartrepo:CartRepository){}


    async getCarRepo():Promise<CartRepository>{
            if(!this.cartrepo){
                this.cartrepo= new CartRepository();
                await this.cartrepo.init();
            }
            return this.cartrepo;
    }
    create(item: Order): Promise<id> {
        throw new Error("Method not implemented.");
    }
    async createWithCart(item:Order,ids:string[]):Promise<id>{
        console.log(ids);
        const conn = await ConnectionManager.getConnection();
        try{
            await conn.exec("BEGIN TRANSACTION");
            await conn.run(CREATE_ORDER,[item.id,item.userId,item.price])
            for(let i =0 ; i < ids.length;i++){
                const cart = await (await this.getCarRepo()).get(ids[i]);
                cart.orderId = item.id;
                await (await this.getCarRepo()).update(cart);
            }
            
            await conn.exec("COMMIT");
            logger.info("the order is created suuccssfully");
            return item.id;
        }catch(error){
            
            await conn.exec("ROLLBACK");
            logger.error("Error while creating the order %s",(error as Error).message);
            throw new DBexception("Error while creating the order ",error as Error);
        }
    }
    get(id: id): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    update(item: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: id): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async init(): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("The table orderwas created succssfully");
        }catch(error){
            logger.error("Error while creating the order table %s " ,(error as Error).message);
            throw new DBexception("Error while creating the order table " ,(error as Error));
        }
    }
    
}