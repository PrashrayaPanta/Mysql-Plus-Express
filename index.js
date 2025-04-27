
// / Express framework for handling HTTP requests and routing
import express from "express";  



import mysql from "mysql2/promise";

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

 const connectDB = async(req, res) =>{
  try{
      const db = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
     });

     console.log("succesfully connected");
     return db;
  }catch(error){
      console.log(error);
  }
}


const db = await connectDB();


export {db}






// Middleware Setup
app.use(cors(corsOptions)); // Use the CORS middleware to allow cross-origin requests


//!Port Initlixation
const PORT = process.env.PORT || 3000;


//!UserRoute

import userRouter from "./Routes/users.js";



//!Task Route
import taskRouter from "./Routes/Task.js";


//!Send the json reponse from the client
app.use(express.json());


//! To parse the cookie from client
app.use(cookieParser());



//!Routes

//!User Routes

app.use("/", userRouter);

//!Task Routes

app.use("/tasks", taskRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

