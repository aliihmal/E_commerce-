import { Collection } from "../model/collection.model";
import { CollectionRepository, getCollectionRepo } from "../repository/collection.Repository";
import { id } from "../repository/IRepository";

export class collectionService{
    private collectionRepo !:CollectionRepository;

    async getRepo():Promise<CollectionRepository>{
        if(!this.collectionRepo){
            this.collectionRepo =await getCollectionRepo();
        }
        return this.collectionRepo;
    }

    async createCollection(item:Collection,productIds:string[]):Promise<id>{
        const id = await (await this.getRepo()).createWithProduct(item,productIds);
        return id;
    }
    async getAllCollection():Promise<Collection[]>{
        const collections= await(await this.getRepo()).getAll();
        return collections;
    }
    async getById(id:string):Promise<Collection>{
        const coll = await (await this.getRepo()).get(id);
        return coll;
    }
    
    async deletById(id:id):Promise<void>{
        await (await this.getRepo()).delete(id);
    }

}