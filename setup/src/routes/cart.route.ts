import { Router } from "express";
import { CartController } from "../controller/Cart.controller";
import { CartService } from "../services/cart.service";
import { CartRepository } from "../repository/cart.Repository";
import asyncHandler from "../middleware/asyncHandeler";
import { authenticate } from "../middleware/auth";

const route = Router();

const cartRepository = new CartRepository();
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

route.get(
    "/getByUser/:id",
    cartController.getUserCart.bind(cartController)
);

route.route("/add/:id")
    .post(authenticate,asyncHandler(cartController.addToCart.bind(cartController)))
route.route("/deletecart/:id")
    .delete(asyncHandler(cartController.DeleteCart.bind(cartController)));

export default route;