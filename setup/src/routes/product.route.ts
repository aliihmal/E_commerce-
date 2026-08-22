import { ProductController } from "../controller/product.controller";
import { productService } from "../services/product.service";

import asyncHandler from "../middleware/asyncHandeler";
import { Router } from "express";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/role";
import { authenticate } from "../middleware/auth";
import multer from "multer";

const productcontroller = new ProductController(new productService());
const route = Router();



const upload = multer({
    storage: multer.memoryStorage()
});

route.route("/")
    .post(authenticate,hasPermission(Permission.WRITE_PRODUCT),
        upload.single("image"),
        asyncHandler(productcontroller.create.bind(productcontroller))
    );
route.route("/getAllProduct")
     .get(asyncHandler(productcontroller.getAllProduct.bind(productcontroller)));

route.route("/get/:id")
     .get(asyncHandler(productcontroller.getById.bind(productcontroller)));

route.route("/getProdOnSale")
          .get(asyncHandler(productcontroller.getProdOnSale.bind(productcontroller)));

route.route("/setProductOnSale")
     .put(authenticate,hasPermission(Permission.WRITE_SALE),asyncHandler(productcontroller.productDiscount.bind(productcontroller)));


route.route("/RemoveFromSale/:id")
     .put(authenticate,hasPermission(Permission.DELETE_SALE),
     asyncHandler(productcontroller.removeDiscount.bind(productcontroller)));
route.route("/getByCollectionId/:collectionId")
     .get(asyncHandler(productcontroller.getByCollectionId.bind(productcontroller)));
route.route("/deleteProd/:id")
     .delete(authenticate,hasPermission(Permission.DELETE_PRODUCT),
     asyncHandler(productcontroller.deleteProduct.bind(productcontroller)));
export default route;