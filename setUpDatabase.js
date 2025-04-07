import mysql from "mysql2/promise";

async function setupDatabase() {
  try {
    //to connect to mysql db

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "BlysIntern",
    });

    console.log("Coonected succesfyully to mysql db");

    //2. create a db

    // const result = await db.execute(`CREATE DATABASE BlysIntern`);

    // console.log(await db.execute("show databases"));

    //3. we create the table

    //  await db.execute(`CREATE TABLE BlysIntern.users(
    //     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //     username VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) NOT NULL UNIQUE,
    //     password VARCHAR(255) NOT NULL
    // )`);
  } catch (error) {
    console.log("Error connecting to mysql db", error);
  }
}
