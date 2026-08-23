import { cartBuilder } from "../model/builder/Cart.builder";
import { Cart } from "../model/cart.model";
import { IMapper } from "./IMapper";

export interface cartRow{
    id:string;
    userId:string;
    productId:string;
    size:string;
    quantity:number;
    orderId:string | null;
}

export class cartMapper implements IMapper<cartRow,Cart>{
    map(data: cartRow): Cart {
        return cartBuilder.newCartBuilder().setId(data.id).setUserId(data.userId).setProductId(data.productId).setQuantity(data.quantity)
        .setSize(data.size).setOrderid(data.orderId).build();
    }
    reverseMap(data: Cart): cartRow {
        throw new Error("Method not implemented.");
    }
    
}