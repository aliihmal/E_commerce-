import { Order } from "../order.model";

export class orderBuilder{
    id!:string;
    userId!:string;
    price!:number;
    public static newOrderBuilder():orderBuilder{
        return new orderBuilder();
    }
    setId(id:string):orderBuilder{
        this.id=id;
        return this;
    }
    setUserId(userid:string):orderBuilder{
        this.userId=userid;
        return this;

    }
    setPrice(price:number):orderBuilder{
        this.price=price;
        return this;
    }
    build():Order{
        console.log("this.id" + this.id);
        console.log("this.userid" + this.userId);
        console.log("this .price " + this.price);
        if(!this.id || !this.userId){
            throw new Error("All the element muust be provided while creating the o;klj;lkj;lkjrder");
        }
        return new Order(this.id,this.userId,this.price);
    }
}