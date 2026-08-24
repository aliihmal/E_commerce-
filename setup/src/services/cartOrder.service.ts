import { Cart } from "../model/cart.model";
import { getCartOrderRepo } from "../repository/cartOrder.Repository";

export class cartOrderManager{
    async getCartOrderByOrderId(orderid:string):Promise<Cart[]>{
        return await (await getCartOrderRepo()).getByOrderId(orderid);

    }
}