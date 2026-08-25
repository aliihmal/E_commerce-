
import { Order } from "../model/order.model";
import { DBexception } from "../util/Exception/repoException";
import logger from "../util/logger";
import { CartRepository } from "./cart.Repository";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";
import { orderMapper, orderRow } from "../mapper/order.mapper";

import { cartOrderRepos } from "./cartOrder.Repository";
import { generateUUID } from "../util";

const CREATE_TABLE =`CREATE TABLE IF NOT EXISTS "order"(
                         id TEXT PRIMARY KEY,
                         "userId" TEXT NOT NULL,
                         price INT NOT NULL)`;

const GET_ALL_ORDER =`SELECT * FROM "order" `;

const CREATE_ORDER =`INSERT INTO "order" (id,"userId",price) VALUES (?,?,?)`;
export class orderRepository implements Initializabel,IRpository<Order>{

    constructor(private cartrepo:CartRepository,private cartOrder:cartOrderRepos){}


    async getCarRepo():Promise<CartRepository>{
            if(!this.cartrepo){
                this.cartrepo= new CartRepository();
                await this.cartrepo.init();
            }
            return this.cartrepo;
    }
    async getCartOrderRepo():Promise<cartOrderRepos>{
        if(!this.cartOrder){
            this.cartOrder=new cartOrderRepos();
            await this.cartOrder.init();
        }
        return this.cartOrder;
    }
    create(item: Order): Promise<id> { 
        throw new Error("Method not implemented.");
    }
    async createWithCart(item:Order,ids:string[]):Promise<id>{
        const conn = await ConnectionManager.getConnection();
        try{
            await conn.exec("BEGIN TRANSACTION");
            await conn.run(CREATE_ORDER,[item.id,item.userId,item.price])
            for(let i =0 ; i < ids.length;i++){
                const cart = await (await this.getCarRepo()).get(ids[i]);
                cart.orderId = item.id;
                cart.id = generateUUID("cartOrder");
                await (await this.getCartOrderRepo()).create(cart);
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
    async getAll(): Promise<Order[]> {
       try{
            const conn = await ConnectionManager.getConnection();
            const myOrder = await conn.all<orderRow[]>(GET_ALL_ORDER);
            if(myOrder.length==0){
                return [];
          }
          logger.info("All the order where retrived succssfully");
            const mapper= new orderMapper();
            return myOrder.map(order => mapper.map(order));
       }catch(error){
        logger.error("Error while retriving all the order %s ",(error as Error).message);
        throw new DBexception("Error whil retiving all the order " , (error as Error));
       }
    }
    
    update(item: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(id: id): Promise<void> {
            const conn = await ConnectionManager.getConnection();
        try{
            
            await conn.exec("BEGIN TRANSACTION");
            await conn.run(`DELETE FROM "order" WHERE id = ? `,[id]);
            const carts = await (await this.getCartOrderRepo()).getByOrderId(id);

            for(let i =0 ; i < carts.length;i++){
                await this.cartrepo.delete(carts[i].id);
            }
            
            await conn.exec("COMMIT");
            logger.info(" the orderes where deleted ");
        }catch(error){
            
            await conn.exec("ROLLBACK");
            logger.error("Erro while delting za ordarz");
            throw new DBexception("Errow whil deleting za ordarz",(error as Error));
        }
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