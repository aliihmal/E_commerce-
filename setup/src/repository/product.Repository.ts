import { error } from "console";
import { productMapper, productRow } from "../mapper/product.mapper";
import { Product } from "../model/product.model";
import { DBexception, InitializabelException } from "../util/Exception/repoException";
import logger from "../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";

const CREATE_TABLE=`CREATE TABLE IF NOT EXISTS "product"(
                                id TEXT PRIMARY KEY,
                                name TEXT NOT NULL,
                                description TEXT NOT NULL,
                                price INT NOT NULL,
                                "salePrice" INT ,
                                "discountPercent" INT ,
                                "onSale" INT NOT NULL,
                                stock INT NOT NULL,
                                "collectionId" TEXT ,
                                "imgSrc" TEXT NOT NULL)`;
const GET_ALL_PRODUCT =`SELECT * FROM "product"`;
const GET_BY_ID=`SELECT * FROM "product" WHERE id = ?`;
const INSERT_PRODUCT = `INSERT INTO "product" (id,name,description,price,"salePrice","discountPercent","onSale",stock,"collectionId","imgSrc") VALUES (?,?,?,?,?,?,?,?,?,?)`

const UPDATE_PRODUCT=`UPDATE "product" SET name=?,description=?,price=?,"salePrice"=?,
                        "discountPercent"=?,"onSale"=?,stock=?,"collectionId"=?,"imgSrc"=?
                        WHERE id = ?`;
const DELETE_PRODUCT = `DELETE FROM "product" WHERE id = ?`;
const GET_BY_COLLECTION=`SELECT * FROM "product" WHERE "collectionId" =?`;

const PROD_ON_SALE =`SELECT * FROM "product" WHERE "onSale" =1 `;
export class ProductRepo implements Initializabel ,IRpository<Product>{
    async create(item: Product): Promise<id> {
       try{
        const conn = await ConnectionManager.getConnection();
        await conn.run(INSERT_PRODUCT,[item.id,item.name,item.description,item.price,item.salePrice,item.discountPercent,item.onSale ? 1 : 0,item.stock
            ,item.collectionId,item.imgSrc
        ]) 
        logger.info("The product was created succssefully");
        return item.id;
       }catch(error ){
        logger.error("Error while creating the product %s ",(error as Error).message);
        throw new DBexception("Error while creating the order",(error as Error));
       }
    }




    async get(id: id): Promise<Product> {
        try{
            const conn = await ConnectionManager.getConnection();
            const res = await conn.get<productRow>(GET_BY_ID,[id]);
            if(!res){
                throw new Error("can't fin the product of id " + id);
            }
            logger.info("product retrivec successfuly");
            const mapper = new productMapper();
            const realRes= mapper.map(res);
            return realRes;
        }catch(error){
            logger.error("Error while retreving the product of the id" +id);
            throw new DBexception("Error while retreivin the product of the specific id " ,(error as Error));
        }
    }




    async getAll(): Promise<Product[]> {
       try{
        const conn  = await ConnectionManager.getConnection();
        const products = await conn.all<productRow[]>(GET_ALL_PRODUCT);
        logger.info("Retrived all the product sesseccfully");
        const mapper  = new productMapper();
        const result = products.map(pro => mapper.map(pro));
        return result;
       }catch(error){
        logger.error("Errro while retriving all the product %s " ,(error as Error).message);
        throw new DBexception("Error while retrieving all the product " , (error as Error));
       }
    }
    async update(item: Product): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_PRODUCT,[item.name,item.description,item.price,
                item.salePrice,item.discountPercent,
                item.onSale ? 1 : 0,item.stock,item.collectionId,item.imgSrc,item.id])
            logger.info("Updated the product succssefully");
        }catch(error){
            logger.error("Error while updating the product   %s " , (error as Error ).message);
            throw new DBexception("Error while updating the product " , (error as Error));
        } 
    } 

    
    async delete(id: id): Promise<void> {
            try {
                const conn = await ConnectionManager.getConnection();

                await conn.run(DELETE_PRODUCT, [id]);

                logger.info("Deleted the product successfully");

            } catch (error) {
                logger.error(
                    "Error while deleting the product %s ",
                    (error as Error).message
                );

                throw new DBexception(
                    "Error while deleting the product ",
                    (error as Error)
                );
            }
    }
    async init(): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Table product was created succssefully");
        }catch(error) {
            logger.error("Errro while creating the product table");
            throw new InitializabelException("error while creaing the product tale",(error as Error));
        }
    }
    
    async getProductOnSale():Promise<Product[]>{
            try{
                const conn = await ConnectionManager.getConnection();
                const prods = await conn.all<productRow[]>(PROD_ON_SALE);
                if(prods.length == 0 ) { 
                    return [];
                }
                logger.info("All the product on sale have been retrieved succsseffully");
                const mapper  = new productMapper();
                return prods.map((prod)=>mapper.map(prod));
            }catch(error){
                logger.error("Error while retriving the product on sale ");
                throw new DBexception("Error while retriving the product on sale " , (error as Error));
            }
    }
    async getByCollection(collectionId:string):Promise<Product[]>{
        try{
            const conn = await ConnectionManager.getConnection();
            const res = await conn.all<productRow[]>(GET_BY_COLLECTION,[collectionId]);
            logger.info("All the product of the specific collection are retrieved");
            const mapper = new productMapper();
            const realResult = res.map(result => mapper.map(result));
            return realResult;
        }catch(error){
            logger.error("Error while retriving the product of the specific collection %s ",(error as Error).message);
            throw new DBexception("Error while retrieving the product of the specific collection " ,(error as Error));
        }
    }

    
}


export async function getProductRepo():Promise<ProductRepo>{
    const repo = new ProductRepo();
     await repo.init();
     return repo;
}