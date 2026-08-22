export class Cart{
    id:string;
    user_id:string;
    product_id:string;
    size:string;
    quantity:number;

    constructor(id:string,user_id:string,product_id:string,size:string,quantity:number){
        this.id=id;
        this.user_id=user_id;
        this.product_id=product_id;
        this.size=size;
        this.quantity=quantity
    }
}