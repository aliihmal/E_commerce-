import { Router } from "express";
import { CollectionController } from "../controller/collection.controller";
import { collectionService } from "../services/collection.service";
import asyncHandler from "../middleware/asyncHandeler";
import { authenticate } from "../middleware/auth";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/role";
import multer from "multer";
const collectioncontroller = new CollectionController(new collectionService());


const route = Router();



const upload = multer({
    storage: multer.memoryStorage()
});

route.route("/")
    .post(
        upload.single("image"),authenticate,hasPermission(Permission.WRITE_COLLECTION),
        asyncHandler(
            collectioncontroller.create.bind(collectioncontroller)
        )
    );
route.route("/GetAll")
            .get(asyncHandler(collectioncontroller.getAll.bind(collectioncontroller)));

route.route("/getById/:id")
        .get(asyncHandler(collectioncontroller.getById.bind(collectioncontroller)));

route.route("/delete/:id")
    .delete(authenticate,hasPermission(Permission.DELETE_COLLECTION),
    asyncHandler(collectioncontroller.deleteById.bind(collectioncontroller)));

export default route;