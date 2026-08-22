import { Collection } from "../collection.model";

export class collectionBuilder { 
     id!:string;
    name!:string;
    description!:string;
    imgSrc!:string
    price!:number
    public static newCollectionBuilder():collectionBuilder{
        return new collectionBuilder();
    }
    setPrice(price:number):collectionBuilder{
        this.price= price;
        return this;
    }
    setId(id:string):collectionBuilder{
        this.id=id;
        return this;
    }
    setName(name:string):collectionBuilder{
        this.name=name;
        return this;
    }
    setDescription(description:string):collectionBuilder{
        this.description=description;
        return this;
    }
    setImgSrc(imgrsrc:string):collectionBuilder{
        this.imgSrc=imgrsrc;
        return this;
    }
    build():Collection{
        if( !this.id || !this.name || !this.description || !this.imgSrc ){
            throw new Error("All the property must be provided while creating the collectin element ");
        }
        return new Collection(this.id,this.name,this.description,this.imgSrc,this.price);
    }
}