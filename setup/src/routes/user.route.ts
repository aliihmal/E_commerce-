import { Router } from "express";
import { userController } from "../controller/user.controller";
import { userServic } from "../services/user.service";
import asyncHandler from "../middleware/asyncHandeler";



const usercontroller = new userController(new userServic());
const route = Router();

route.route("/")
    .post(asyncHandler(usercontroller.create.bind(usercontroller)));

route.route("/update")
        .put(asyncHandler(usercontroller.updateUser.bind(usercontroller)));

export default route;