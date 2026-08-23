import { Router } from "express";
import productRoute from "./product.route"
import collectionRoute from"./collection.route"
import userRoute from "./user.route"
import Auth from "./auth.route"
import CartRoute from "./cart.route"
import OrderRoute from "./order.route"
const router = Router();
router.get("/",(req,res)=>{
    res.json({message:"hello world"});
})

router.use("/user",userRoute);
router.use("/collection",collectionRoute);
router.use("/product", productRoute);
router.use("/cart",CartRoute);
router.use("/auth",Auth);
router.use("/order",OrderRoute);
export default router;