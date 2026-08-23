import { Router } from "express";
import { orderController } from "../controller/order.controller";
import { orderManager } from "../services/order.service";
import { CartRepository } from "../repository/cart.Repository";
import { orderRepository } from "../repository/order.Repository";
import { ProductRepo } from "../repository/product.Repository";
import asyncHandler from "../middleware/asyncHandeler";
import { authenticate } from "../middleware/auth";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/role";

const route = Router();
const ordercontroler = new orderController(new orderManager(new CartRepository()
,new orderRepository(new CartRepository())
,new ProductRepo()));

route.route("/:id")
    .post(asyncHandler(ordercontroler.create.bind(ordercontroler)));
route.route("/getAll")
        .get(authenticate,hasPermission(Permission.READ_ORDER),asyncHandler(ordercontroler.getAllOrder.bind(ordercontroler)));

export default route;