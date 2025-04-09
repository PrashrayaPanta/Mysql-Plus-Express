import express from "express";

const userRouter =  express.Router();

import { isLogin } from "../middleware/isLogin.js";

import {
  UserRegisterController,
  userLoginController,
  userProfileController,
  userLogoutController
} from "../controllers/User.js";


userRouter.post("/register", UserRegisterController);
userRouter.post("/login", userLoginController);
userRouter.get("/dashboard", isLogin, userProfileController);
userRouter.get("/logout", userLogoutController);


export default userRouter;