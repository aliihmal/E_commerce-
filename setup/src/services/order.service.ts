import { orderBuilder } from "../model/builder/order.builder";
import { Order } from "../model/order.model";
import { CartRepository } from "../repository/cart.Repository";
import { id } from "../repository/IRepository";
import { orderRepository } from "../repository/order.Repository";
import { ProductRepo } from "../repository/product.Repository";
import { generateUUID } from "../util";

export class orderManager{ 
    constructor(private cartRepo:CartRepository,private orderrepo:orderRepository,private productrepo :ProductRepo){}

    async createOrder(ids:string[],id:string):Promise<id>{
       await this.orderrepo.init();
       let price =0 ; 
       await this.cartRepo.init();
       await this.productrepo.init();
       for(let i =0 ; i < ids.length;i++){
        const cart =await this.cartRepo.get(ids[i]);
        const prod =await this.productrepo.get((await cart).product_id);
          if( prod.onSale && prod.salePrice){
            price+=prod.salePrice*cart.quantity;
          }else{
            price +=(prod.price * cart.quantity);
          }
       }

       const myorder =  orderBuilder.newOrderBuilder().setId(generateUUID("order")).setUserId(id).setPrice(price).build();
       const theid=await this.orderrepo.createWithCart(myorder,ids);
       return theid;
    }

    async getAllOrder():Promise<Order[]>{
      const orders = await this.orderrepo.getAll();
      return orders;
    }
}