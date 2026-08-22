import { Collection } from "../model/collection.model";
import { Product } from "../model/product.model";
import { id } from "../repository/IRepository";
import { getProductRepo, ProductRepo } from "../repository/product.Repository";

export class productService { 
    private productrepo !:ProductRepo;
    
    async getRepo():Promise<ProductRepo>{
        if(!this.productrepo){
            this.productrepo= await getProductRepo();
        }
        return this.productrepo;
    }

    async createProduct(item:Product):Promise<id>{
        const id = await (await this.getRepo()).create(item);
        return id;
    }
    async getAllProduct():Promise<Product[]>{
        const result = await ( await this.getRepo()).getAll();
        return result;
    }
    async getProductById(id:string):Promise<Product>{
        const result = await ( await this.getRepo()).get(id);
        return result;
    }
    async updateCollectionId(productIds:string[],collectionId:string):Promise<void>{
        for(let i =0 ; i<productIds.length;i++){
            const myproduct = await (await this.getRepo()).get(productIds[i]);
            myproduct.collectionId=collectionId;
            await (await this.getRepo()).update(myproduct);
        }
    }

    async updateTheProductOnSale(item:Product,discountPercent:number):Promise<void>{
        if (discountPercent < 0 || discountPercent > 100) {
            throw new Error("Discount must be between 0 and 100");
       }
        item.onSale= true;
        item.discountPercent=discountPercent;
        item.salePrice = item.price * (1 - discountPercent / 100);
        await (await this.getRepo()).update(item);
    }

    async removeProductFromSale(item:Product):Promise<void>{
        item.onSale=false;
        item.discountPercent=0;
        item.salePrice=null;
        await (await this.getRepo()).update(item);
    }
    async getByCollectionId(collectionId :string):Promise<Product[]>{
        const products = await (await this.getRepo()).getByCollection(collectionId);
        return products;
    }

    async getProdOnSale():Promise<Product[]>{
        const products = await (await this.getRepo()).getProductOnSale();
        return products;
    }
    async deleteProduct(id:string):Promise<void>{
        await (await this.getRepo()).delete(id);
    }

    
}