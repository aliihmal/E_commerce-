import { Cart } from "../cart.model";

export class cartBuilder{
    id!:string;
    user_id!:string;
    product_id!:string;
    size!:string;
    quantity!:number;

    public static newCartBuilder():cartBuilder{
        return new cartBuilder();
    }

    setQuantity(quantity:number):cartBuilder{
        this.quantity=quantity;
        return this;
    }
    setSize(size:string):cartBuilder{
        this.size=size;
        return this;
    }
    setProductId(prodId:string):cartBuilder{
        this.product_id=prodId;
        return this;
    }
    setUserId(user_id:string):cartBuilder{
        this.user_id=user_id;
        return this;
    }
    setId(id:string):cartBuilder{
        this.id=id;
        return this;
    }
    build():Cart{
        if(!this.id || !this.user_id || !this.product_id || !this.quantity || !this.size || ! this.quantity){
            throw new Error("All the element must be provided before creating the cart item");
        }
        return new Cart(this.id,this.user_id,this.product_id,this.size,this.quantity);
    }
}