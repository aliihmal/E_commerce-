import { collectionBuilder } from "../model/builder/collection.builder";
import { Collection } from "../model/collection.model";
import { IMapper } from "./IMapper";

export interface collectionRow{
    id:string;
    name:string;
    description:string;
    imgSrc:string;
    price:number
}
export class collectionMapper implements IMapper<collectionRow,Collection>{
    map(data: collectionRow): Collection {
      return collectionBuilder.newCollectionBuilder().setId(data.id).setName(data.name)
      .setDescription(data.description).setImgSrc(data.imgSrc).setPrice(data.price).build();
    }
    reverseMap(data: Collection): collectionRow {
        throw new Error("Method not implemented.");
    }
    
}