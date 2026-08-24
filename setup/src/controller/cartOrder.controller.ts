import { Request, Response } from "express";
import { cartOrderManager } from "../services/cartOrder.service";

export class cartOrderController{
    constructor(private cartordermanager:cartOrderManager){}

    async getByOrderId(req:Request,res:Response):Promise<void>{
        const id = req.params.id as string;
        const cartss = await this.cartordermanager.getCartOrderByOrderId(id);
        res.status(200).json({"message":"The cart with order id are retrived",
            "carts":cartss
        })
    }
}