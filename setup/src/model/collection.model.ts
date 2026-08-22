export class Collection{
    id:string;
    name:string;
    description:string;
    imgSrc:string;
    price:number


    constructor(id:string,name:string,description:string,imgSrc:string,price:number){
        this.id=id;
        this.name=name;
        this.description=description;
        this.imgSrc=imgSrc
        this.price=price;
    }
}