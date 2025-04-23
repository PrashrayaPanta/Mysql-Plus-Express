import express from "express";
import { isLogin } from "../middleware/isLogin.js";
import {getTasksController, PostTaskController, deleteTaskController } from "../controllers/Task.js";

const taskrouter =  express.Router();

taskrouter.get("/", isLogin, getTasksController);
taskrouter.post("/", isLogin, PostTaskController);
taskrouter.delete("/:id", isLogin, deleteTaskController);

export default taskrouter;