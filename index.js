
// / Express framework for handling HTTP requests and routing
import express from "express";   

//!  Middleware for parsing cookies in requests

import cookieParser from "cookie-parser"; 


//!  Middleware to enable Cross-Origin Resource Sharing (CORS) for your app


import cors from "cors";    


//! Create an instance of an Express app

const app = express(); 

//! Load environment variables from a .env file using dotenv
import dotenv from "dotenv"; 

dotenv.config(); 

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, 

}

// Middleware Setup
app.use(cors(corsOptions)); // Use the CORS middleware to allow cross-origin requests


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

