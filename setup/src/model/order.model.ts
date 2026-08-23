export class Order{
    id:string;
    userId:string;
    price:number;
    constructor(id:string,userid:string,price:number){
        this.id=id;
        this.userId=userid;
        this.price=price
    }
}