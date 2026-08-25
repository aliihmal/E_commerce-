import { collectionMapper, collectionRow } from "../mapper/collection.mapper";
import { Collection } from "../model/collection.model";
import { DBexception, InitializabelException } from "../util/Exception/repoException";
import logger from "../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";
import { ProductRepo } from "./product.Repository";
const CREATE_TABLE =`CREATE TABLE IF NOT EXISTS "collection"(
                                id TEXT PRIMARY KEY,
                                name TEXT NOT NULL,
                                description TEXT NOT NULL,
                                "imgSrc" TEXT NOT NULL,
                                price INT)`;
const CREATE_COLLECTION=`INSERT INTO "collection" (id,name,description,"imgSrc",price) VALUES (?,?,?,?,?)`
const DELETE_COLLECTION = `DELETE FROM "collection" WHERE id = ?`;
const GET_ALL_COLLECTION=`SELECT * FROM "collection"`;

const GET_BY_ID=`SELECT * FROM "collection" WHERE id =?`;
export class CollectionRepository implements Initializabel ,IRpository<Collection>{
    constructor(private productrepo :ProductRepo){}
    async create(item: Collection): Promise<id> {
      try{
        const conn  = await ConnectionManager.getConnection();
        await conn.run(CREATE_COLLECTION,[item.id,item.name,item.description,item.imgSrc,item.price]);
        logger.info("The collection Was created successfully");
        return item.id; 
      }catch(error){
        logger.error("Error while creating the collection %s",(error as Error).message);
        throw new DBexception("Error while creating the collection ",(error as Error));
      }
    }



    async createWithProduct(item:Collection,productsIds:string[]):Promise<id>{
         const conn = await ConnectionManager.getConnection();
        try{
            await conn.exec("BEGIN TRANSACTION");
            await conn.run(CREATE_COLLECTION,[item.id,item.name,item.description,item.imgSrc,item.price]);
              await this.productrepo.init();
            for(let i =0 ; i < productsIds.length;i++){
                const myProduct   = await this.productrepo.get(productsIds[i]);
                myProduct.collectionId=item.id;
                await this.productrepo.update(myProduct);
            }
             await conn.exec("COMMIT");
            logger.info("the collection with the product is created succssefully");
            return item.id;
        }catch(error){
            
            await conn.exec("ROLLBACK");
            logger.error("Error While creating the collection");
            throw new DBexception("Error while creating the collectino",(error as Error));
        }
    }






    
    async get(id: id): Promise<Collection> {
        try{
            const conn = await ConnectionManager.getConnection();
            const collection = await conn.get<collectionRow>(GET_BY_ID,[id]);
            if(!collection){
                throw new Error ("Error while retrieving the collection of the specific id ");
            }
            logger.info("The collectin of the specific id is retrieved succssefuly");
            const mapper = new collectionMapper();
            const realResult = mapper.map(collection);
            return realResult;
        }catch(error){
            logger.error("Error while retrieving the collection of the specific id %s " ,(error as Error).message);
            throw new DBexception("Error while retreivin the collection of the specific id ",(error as Error));
        }
    }


    async getAll(): Promise<Collection[]> {
        try{
          const conn= await ConnectionManager.getConnection();
          const result= await conn.all<collectionRow[]>(GET_ALL_COLLECTION);
          logger.info("All the collectin are retrivied succsseffuly");
           if(result.length==0){
            return [];
           }
          const mapper = new collectionMapper();
           const realResult = result.map(res => mapper.map(res));
           return realResult;
        }catch(error){
            logger.error("Error while retrieving All the collections %s",(error as Error).message);
            throw new DBexception("Error while retrieving All the collections " ,(error as Error));
        }
    }
    update(item: Collection): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async delete(id: id): Promise<void> {
            try {
                const conn = await ConnectionManager.getConnection();
             await conn.run(DELETE_COLLECTION, [id]);

                

                logger.info(
                    "The collection with id %s was deleted successfully",
                    id
                );

            } catch (error) {
                logger.error(
                    "Error while deleting the collection %s",
                    (error as Error).message
                );

                throw new DBexception(
                    "Error while deleting the collection",
                    error as Error
                );
            }
        }
    async init(): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("The collection table was created successsfully");
            
        }catch(error ){
            logger.error("Error while creating the collection table %s " , (error as Error).message);
            throw new InitializabelException("Error while creatingthe collection table " , (error as Error));
        }
    } 
}

export async function getCollectionRepo():Promise<CollectionRepository>{
    const coll= new CollectionRepository(new ProductRepo());
    await coll.init();
    return coll;
}