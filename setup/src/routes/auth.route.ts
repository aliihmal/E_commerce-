import { Router } from "express";
import { AuthController } from "../controller/Auth.controller";
import { AuthenticatinService } from "../services/Auth.service";
import { userServic } from "../services/user.service";
import asyncHandler from "../middleware/asyncHandeler";
import { authenticate } from "../middleware/auth";
import { AuthReq } from "../config/type";

const authcontroller = new AuthController(new AuthenticatinService(),new userServic());
const route = Router();

route.route("/login")
        .post(asyncHandler(authcontroller.login.bind(authcontroller)));

route.get("/me", authenticate, (req, res) => {
    res.json({
        authenticated: true,
        user: (req as unknown as AuthReq).user
    });
});
route.route("/logout")
        .post(asyncHandler(authcontroller.logout.bind(authcontroller)));
export default route;
