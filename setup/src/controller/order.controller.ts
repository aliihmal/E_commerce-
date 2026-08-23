import { Request, Response } from "express";
import { ERROR } from "sqlite3";
import { orderManager } from "../services/order.service";

export class orderController {
    
    constructor(private orderservice :orderManager){}


    async create(req:Request,res:Response):Promise<void>{
        const ids = req.body;
        const id = req.params.id as string;
        if(!ids ||!id){
            throw new Error("All the element must be provided before creating the order in the")
        }
         const theid =  await this.orderservice.createOrder(ids.ids,id);
        res.status(200).json({"messge":"order created succssfuly",
            "order":theid
        })
    }
}