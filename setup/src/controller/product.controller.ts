import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { BadRequestException } from "../util/Exception/httpException";
import { productBuilder } from "../model/builder/product.builder";
import { generateUUID } from "../util";
import imagekit from "../services/imagekit.service";

export class ProductController{
 constructor(private productmanager:productService){}

  async create(req: Request, res: Response): Promise<void> {

    const { name, description, price } = req.body;

    if (!name || !description || !price ) {
        throw new BadRequestException(
            "Something is missing during the creating of the product in the controller",
            {
                name: !name,
                description: !description,
                price: !price
            }
        );
    }

    if (!req.file) {
        throw new BadRequestException(
            "Product image is required",
            {}
        );
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/products"
    });

    // ImageKit URL
    const imgSrc = uploadedImage.url;

    const myProduct = productBuilder
        .newProductBuilder()
        .setId(generateUUID("product"))
        .setName(name)
        .setDescription(description)
        .setPrice(price)
        .setStock(100)
        .setImgSrc(imgSrc)
        .setDiscountPercent(0)
        .setSalePrice(null)
        .setonSale(false)
        .setcollectionId(null)
        .build();

    await this.productmanager.createProduct(myProduct);

    res.status(200).json({
        message: "Product was created successfully",
        id: myProduct.id,
        imgSrc: imgSrc
    });
}

  async getAllProduct(req:Request,res:Response):Promise<void>{
    const Products = await this.productmanager.getAllProduct();
    res.status(200).json({"message":"All the product are retrived succeessfully",
            "products" :Products,
    })
  }

  async getById(req:Request,res:Response):Promise<void>{
     const id = req.params.id  as string;
     const product = await this.productmanager.getProductById(id);
     res.status(200).json({"message":"The product is retrieved successfully",
      "product":product
     })
  }
  async getByCollectionId(req:Request,res:Response):Promise<void>{
    const collectionid = req.params.collectionId as string;
    const products  = await this.productmanager.getByCollectionId(collectionid);
    res.status(200).json({"message":"All the product of the specific collection were retrived succssefullly",
        "products":products,
    }) 
  }

  async deleteProduct(req:Request,res:Response):Promise<void>{
    const id = req.params.id as string;
    if(!id){
      throw new Error ("The id must be provided before deleting a product ");
    }
    await this.productmanager.deleteProduct(id);
    res.status(200).json({"message" : "The product was deleted succssefuly"});
  }
  
  async getProdOnSale(req:Request,res:Response):Promise<void>{
    const products = await this.productmanager.getProdOnSale();
    res.status(200).json({"message":"The product on sale are retrieved",
        "products":products
    })
  }

  async productDiscount(req:Request,res:Response):Promise<void>{
    const {discountPercent,productId} = req.body;
    const product = await this.productmanager.getProductById(productId);
    await this.productmanager.updateTheProductOnSale(product,discountPercent);

    res.status(200).json({"message" :"The sale was added succssefuly"});
  }

  async removeDiscount(req:Request,res:Response):Promise<void>{
    const id = req.params.id as string;

    const product = await this.productmanager.getProductById(id);
    await this.productmanager.removeProductFromSale(product);
    res.status(200).json({"message":"The product was remove from the sales"})
  }
}