import { Router } from "express";
import { cartOrderController } from "../controller/cartOrder.controller";
import { cartOrderManager } from "../services/cartOrder.service";
import { authenticate } from "../middleware/auth";
import { hasPermission } from "../middleware/authorize";
import asyncHandler from "../middleware/asyncHandeler";

const cartordercontroller = new cartOrderController(new cartOrderManager());


const route = Router();

route.route("/getByOrderId/:id")
        .get(asyncHandler(cartordercontroller.getByOrderId.bind(cartordercontroller)));


export default route;