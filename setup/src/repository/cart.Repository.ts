import { Cart } from "../model/cart.model";
import { DBexception } from "../util/Exception/repoException";
import logger from "../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { id, Initializabel, IRpository } from "./IRepository";
import { cartMapper, cartRow } from "../mapper/Cart.mapper";



const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "cart"(
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    size TEXT NOT NULL,
    quantity INT,
    "orderId" TEXT
)`;

const GET_BY_ORDER=`SELECT * FROM "cart" WHERE "orderId" = ? `;
export class CartRepository implements Initializabel, IRpository<Cart> {

    async create(item: Cart): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();

            await conn.run(
                `INSERT INTO "cart"
                (id, "userId", "productId", size, quantity, "orderId")
                VALUES (?, ?, ?, ?, ?, ? )`,
                [
                    item.id,
                    item.user_id,
                    item.product_id,
                    item.size,
                    item.quantity,
                    item.orderId
                ]
            );

            logger.info("Cart item created successfully");

            return item.id;

        } catch (error) {
            logger.info(
                "Error while creating the cart item the real cart %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while creating the cart item",
                error as Error
            );
        }
    }
    
    async getByOrderId(orderId:string):Promise<Cart[]>{
        try{
            const conn = await ConnectionManager.getConnection();
            const myCarts = await conn.all<cartRow[]>(GET_BY_ORDER,[orderId]);
            if(myCarts.length==0){
                return [];
            }
            logger.info("All the cart of  a specific order where retrived succssfuly");
            const mapper = new cartMapper();
            return myCarts.map(cart => mapper.map(cart));
        }catch(error){
            logger.error("Error while retriving the cart of this specific order %s",(error as Error).message);
            throw new DBexception("Error while retriving the cart of this specific order %s",(error as Error))
        }
    }
    async get(id: id): Promise<Cart> {
        try {
            const conn = await ConnectionManager.getConnection();

            const row = await conn.get<cartRow>(
                `SELECT *
                 FROM "cart"
                 WHERE id = ?`,
                [id]
            );

            if (!row) {
                throw new Error(
                    `Cart item with id ${id} was not found`
                );
            }

            const mapper = new cartMapper();

            return mapper.map(row);

        } catch (error) {
            logger.info(
                "Error while getting cart item %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while getting the cart item",
                error as Error
            );
        }
    }

    async getAll(): Promise<Cart[]> {
        try {
            const conn = await ConnectionManager.getConnection();

            const rows = await conn.all<cartRow[]>(
                `SELECT id, "userId", "productId", size, quantity
                 FROM "cart"`
            );

            const mapper = new cartMapper();

            return rows.map((row) => mapper.map(row));

        } catch (error) {
            logger.info(
                "Error while getting all cart items %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while getting all cart items",
                error as Error
            );
        }
    }

    async update(item: Cart): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
await conn.run(
                `UPDATE "cart"
                 SET "userId" = ?,
                     "productId" = ?,
                     size = ?,
                     quantity = ?,
                     "orderId" =  ?
                 WHERE id = ?`,
                [
                    item.user_id,
                    item.product_id,
                    item.size,
                    item.quantity,
                    item.orderId,
                    item.id
                ]
            );

        
            logger.info("Cart item updated successfully");

        } catch (error) {
            logger.info(
                "Error while updating cart item %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while updating the cart item",
                error as Error
            );
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();

             await conn.run(
                `DELETE FROM "cart"
                 WHERE id = ?`,
                [id]
            );

          

            logger.info("Cart item deleted successfully");

        } catch (error) {
            logger.info(
                "Error while deleting cart item %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while deleting the cart item",
                error as Error
            );
        }
    }


    async getByUserId(userId: string): Promise<Cart[]> {
    try {
        const conn = await ConnectionManager.getConnection();

        const rows = await conn.all<cartRow[]>(
            `SELECT id, "userId", "productId", size, quantity, "orderId"
             FROM "cart"
             WHERE "userId" = ?`,
            [userId]
        );

        const mapper = new cartMapper();

        return rows.map((row) => mapper.map(row));

    } catch (error) {
        logger.info(
            "Error while getting cart for user %s",
            (error as Error).message
        );

        throw new DBexception(
            "Error while getting the cart for the user",
            error as Error
        );
    }
}
    
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();

            await conn.exec(CREATE_TABLE);

            logger.info("The table cart was created successfully");

        } catch (error) {
            logger.info(
                "Error while creating the cart table %s",
                (error as Error).message
            );

            throw new DBexception(
                "Error while creating the cart table",
                error as Error
            );
        }
    }

}