import { orderBuilder } from "../model/builder/order.builder";
import { Order } from "../model/order.model";
import { IMapper } from "./IMapper";

export interface orderRow{
     id :string;
    userId :string;
    price :number;
}


export class orderMapper implements IMapper<orderRow,Order>{
    map(data: orderRow): Order {
        return orderBuilder.newOrderBuilder().setId(data.id).setUserId(data.userId).setPrice(data.price).build();
    }
    reverseMap(data: Order): orderRow {
        throw new Error("Method not implemented.");
    }

}