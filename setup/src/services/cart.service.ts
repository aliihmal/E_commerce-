import { Cart } from "../model/cart.model";
import { CartRepository } from "../repository/cart.Repository";
import { id } from "../repository/IRepository";
import { generateUUID } from "../util";
import { DBexception } from "../util/Exception/repoException";
import logger from "../util/logger";

export class CartService {

    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async getUserCart(userId: string): Promise<Cart[]> {
        try {
            await this.cartRepository.init();
            return await this.cartRepository.getByUserId(userId);

        } catch (error) {
            logger.info(
                "Error while retrieving user cart %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while retrieving user cart",
                error as Error
            );
        }
    }

    async addToCart(
        userId: string,
        productId: string,
        size: string
    ): Promise<Cart> {

        try {
            
            await this.cartRepository.init();
            const cart = await this.cartRepository.getByUserId(userId);

            const existingItem = cart.find(
                (item) =>
                    item.product_id === productId &&
                    item.size === size
            );

            if (existingItem) {

                existingItem.quantity += 1;

                await this.cartRepository.update(existingItem);

                return existingItem;
            }

            const newCartItem: Cart = {
                id: generateUUID("cart"),
                user_id: userId,
                product_id: productId,
                size: size,
                quantity: 1,
                orderId: null
            };

            await this.cartRepository.create(newCartItem);

            return newCartItem;

        } catch (error) {
            logger.info(
                "Error while adding product to cart %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while adding product to cart",
                error as Error
            );
        }
    }

    async Delete(id:id):Promise<void>{
        const mycart =await this.cartRepository.get(id);
        if (mycart.quantity > 1 ) { 
            mycart.quantity = mycart.quantity -1
            await this.cartRepository.update(mycart);
            return;
        }
        await this.cartRepository.delete(id);;
        return;
    }
}