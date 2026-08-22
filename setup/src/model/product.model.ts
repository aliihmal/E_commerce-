export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    discountPercent: number | null;
    onSale: boolean;
    stock: number;
    collectionId: string | null;
    imgSrc:string;
  constructor(id:string,name:string,description:string,price:number,saleprice:number |null,discountPercent:number | null,onsale:boolean,
    stock:number,collectionId:string | null,imgSrc:string
  ){
    this.id=id;
    this.name=name;
    this.price=price;
    this.salePrice=saleprice;
    this.description=description;
    this.discountPercent=discountPercent;
    this.onSale=onsale;
    this.stock=stock;
    this.collectionId=collectionId
    this.imgSrc=imgSrc;
  }
}