import express from "express";
import { isLogin } from "../middleware/isLogin.js";
import {getTasksController, PostTaskController, deleteTaskController } from "../controllers/Post.js";

const postrouter =  express.Router();

postrouter.get("/", isLogin, getTasksController);
postrouter.post("/", isLogin, PostTaskController);
postrouter.delete("/:id", isLogin, deleteTaskController);

export default postrouter;