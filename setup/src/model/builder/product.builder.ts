import { Product } from "../product.model";

export class productBuilder{
     id!: string;
    name!: string;
    description!: string;
    price!: number;
    salePrice!: number | null;
    discountPercent!: number | null;
    onSale!: boolean;
    stock!: number;
    collectionId!: string | null;
    imgSrc!:string;

    public static newProductBuilder():productBuilder{
        return new productBuilder();
    }
    
    
    setImgSrc(imgSrc:string):productBuilder{
        this.imgSrc=imgSrc;
        return this;
    }
    setcollectionId(collectionId:string | null):productBuilder{
        this.collectionId=collectionId;
        return this;
    }
    setStock(stock:number):productBuilder{
        this.stock=stock
        return this;
    }
    
    setonSale(onsale:boolean):productBuilder{
        this.onSale=onsale
        return this;
    }
    
    setDiscountPercent(discountPercent:number):productBuilder{
        this.discountPercent=discountPercent
        return this;
    }
    
    setSalePrice(salePrice:number | null):productBuilder{
        this.salePrice=salePrice
        return this;
    }
    
    setPrice(price:number):productBuilder{
        this.price=price
        return this;
    }
    setDescription(description:string):productBuilder{
        this.description=description
        return this;
    }
    setName(name:string):productBuilder{
        this.name=name
        return this;
    }
    setId(id:string):productBuilder{
        this.id=id;
        return this;
    }
    build():Product{
        if(!this.id  || !this.name || !this.description || !this.price || !this.stock || !this.imgSrc){
            throw new Error("All the attribute must be provided before making the product ");
        }
        return new Product(this.id,this.name,this.description,this.price,this.salePrice,this.discountPercent,this.onSale,this.stock,this.collectionId,this.imgSrc);
    }
}