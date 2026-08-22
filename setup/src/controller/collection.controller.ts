import { Request, Response } from "express";
import { collectionService } from "../services/collection.service";
import { BadRequestException } from "../util/Exception/httpException";
import { collectionBuilder } from "../model/builder/collection.builder";
import { generateUUID } from "../util";
import imagekit from "../services/imagekit.service";

export class CollectionController{
    constructor(private collectionManager:collectionService){}

    async create(req: Request, res: Response): Promise<void> {

    const { name, description, price } = req.body;
    const productids = req.body.productids;

    if (!name || !description || !price) {
        throw new BadRequestException(
            "Something is missing during the creation of the collection",
            {
                name: !name,
                description: !description,
                price: !price
            }
        );
    }

    if (!req.file) {
        throw new BadRequestException(
            "Collection image is required",
            {}
        );
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/collections"
    });

    const imgSrc = uploadedImage.url;

    const myCollection = collectionBuilder
        .newCollectionBuilder()
        .setId(generateUUID("collection"))
        .setName(name)
        .setDescription(description)
        .setImgSrc(imgSrc)
        .setPrice(Number(price))
        .build();

    const products = Array.isArray(productids)
        ? productids
        : [productids];

    // Controller → Service
    await this.collectionManager.createCollection(
        myCollection,
        products
    );

    res.status(200).json({
        message: "Collection was created successfully",
        id: myCollection.id,
        imgSrc: imgSrc
    });
}
    async getAll(req:Request,res:Response):Promise<void>{
        const collections = await this.collectionManager.getAllCollection();
        res.status(200).json({"Message":"All the collections item were retrieved succssfully",
            "collections":collections,
        })
    }

    async getById(req:Request,res:Response):Promise<void>{
        const id = req.params.id as string;
        const collection = await this.collectionManager.getById(id);
        res.status(200).json({"message":"The collection of the specific id is retrieved sessccefully",
            "collection":collection
        })
    }

    async deleteById(req:Request,res:Response):Promise<void>{
        const id = req.params.id as string;
        await this.collectionManager.deletById(id);
        res.status(200).json({"message":"The collection was deleted succeeffully"})
    }
}