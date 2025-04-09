import mysql from "mysql2/promise";

export const connectDB = async(req, res) =>{
    try{
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
       });


       return db;

    }catch(error){
        console.log(error);
    }

       




}

