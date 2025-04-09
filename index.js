// Import required modules for the application
import express from "express";          // Express framework for handling HTTP requests and routing
import cookieParser from "cookie-parser"; // Middleware for parsing cookies in requests
import cors from "cors";               // Middleware to enable Cross-Origin Resource Sharing (CORS) for your app

const app = express(); // Create an instance of an Express app

// Load environment variables from a .env file using dotenv
import dotenv from "dotenv"; // dotenv helps load environment variables from .env files
dotenv.config(); // Automatically load the environment variables into the process.env object

// Middleware Setup
app.use(cors()); // Use the CORS middleware to allow cross-origin requests
// Without CORS, browsers will block requests from a different domain/port

//!Port Initlixation
const PORT = process.env.PORT || 3000;


//!UserRoute

import userRouter from "./Routes/users.js";



//!Task Route
import postRouter from "./Routes/Post.js";


//!Send the json reponse from the client
app.use(express.json());


//! To parse the cookie from client
app.use(cookieParser());



//!Routes

//!User Routes

app.use("/", userRouter);

//!Task Routes

app.use("/tasks", postRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

