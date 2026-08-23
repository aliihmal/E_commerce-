import { Request, Response } from "express";
import { CartService} from "../services/cart.service"
import logger from "../util/logger";

export class CartController {

    private cartService: CartService;

    constructor(cartService: CartService) {
        this.cartService = cartService;
    }

    async getUserCart(req: Request, res: Response): Promise<void> {
        try {
            const  userId  = req.params.id as string;

            const cart = await this.cartService.getUserCart(userId);

            res.status(200).json(cart);

        } catch (error) {
            logger.error(
                "Error while retrieving user cart: %s",
                (error as Error).message
            );

            throw error;
        }
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const  userId  = req.params.id as string;
            const { productId, size } = req.body;

            const cartItem = await this.cartService.addToCart(
                userId,
                productId,
                size
            );

            res.status(200).json(cartItem);

        } catch (error) {
            logger.error(
                "Error while adding product to cart: %s",
                (error as Error).message
            );

            throw error;
        }
    }
    async DeleteCart(req:Request,res:Response):Promise<void>{
        const id = req.params.id as string;
         
        await this.cartService.Delete(id);
        res.status(200).json({"message":"the cart was deleted succssefully"});
    }

    async getByOrderId(req:Request,res:Response):Promise<void>{
        const orderId = req.params.orderId as string;

        const myCarts = await this.cartService.getByOrderid(orderId);
        res.status(200).json({"message":"The cart of the specific order are retrived succssfuly",
            "carts":myCarts
        })
    }
}