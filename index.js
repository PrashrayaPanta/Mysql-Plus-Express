import mysql from "mysql2/promise";

import express from "express";

import { isLogin } from "./middleware/isLogin.js";

// console.log(isLogin);

import cookieParser from "cookie-parser";

const app = express();

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

app.use(express.json());

app.use(cookieParser());

async function setupDatabase() {
  try {
    //to connect to mysql db

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "BlysIntern",
    });



  //   db.execute(`CREATE TABLE tasks(
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     user_id INT NOT NULL,
  //     title VARCHAR(255) NOT NULL,
  //     description TEXT,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  //     FOREIGN KEY (user_id) REFERENCES users(id)
  // )`);

    //! Register the user
    app.post("/register", async (req, res) => {
      const { username, email, password } = req.body;

      //! Validations

      if (!username || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [
        email,
      ]);
      if (rows.length > 0) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      //!hash user password

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      //!create the user

      const [result] = await db.execute(
        `INSERT INTO users (username, email, password) VALUES(?,?,?)`,
        [username, email, hashedPassword]
      );

      console.log(result);

      //! Get the newly created User

      const [newUser] = await db.execute(
        `SELECT id, username, email FROM users WHERE id = ?`,
        [result.insertId]
      );

      //! Send the response

      res.status(201).json({
        message: "User added successfully",
        username: newUser[0].username,
        email: newUser[0].email,
        id: newUser[0].id,
      });
    });

    //! Login the user
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      //! Check if user email exists

      const user = await db.execute(`SELECT * FROM users WHERE email = ?`, [
        email,
      ]);

      if (user[0].length === 0) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }

      //! Check if password is correct
      const isMatch = await bcrypt.compare(password, user[0][0].password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      //! Generate a token
      const token = jwt.sign({ id: user[0][0].id }, "anykey", {
        expiresIn: "1h",
      });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false, // Disable in development (no HTTPS)
        maxAge: 3600000, // 1 hour expiry
        sameSite: "lax", // 'strict' can block cookies in localhost
        domain: "localhost", // Only for localhost (optional)
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        id: user[0][0].id,
        username: user[0][0].username,
        email: user[0][0].email,
      });
    });

    app.get("/dashboard", isLogin, async (req, res) => {
      console.log("Hello");

      const [user] = await db.execute(`SELECT * FROM users WHERE id = ?`, [
        req.user_id,
      ]);

      console.log(user[0]);

      res.json({ message: "Access granted", LoggedInUserInfo: user[0] });
    });

    app.get("/logout", async (req, res) => {
      // console.log(req.cookies.authToken);

      res.clearCookie("authToken");

      res.status(200).json({
        message: "User logged out successfully",
      });
    });

    //Create the task
    app.post("/tasks", isLogin, async (req, res) => {
      const { title, description } = req.body;

      await db.execute(`INSERT INTO tasks (title, description, user_id) VALUES(?,?, ?)`, [
        title,
        description,
        req.user_id,
      ]);

      res.status(201).json({
        message: "Task added successfully",
      });
    });

    //get the Tasks

    app.get("/tasks", isLogin, async (req, res) => {
      console.log(req.user_id);

      const [rows] = await db.execute(`SELECT * FROM tasks WHERE user_id = ?`, [
        req.user_id,
      ]);

      // console.log(user[0]);

      // const [rows] = await db.execute(`Select * from tasks`);

      // console.log(rows);

      res.status(200).json({
        message: "Tasks fetched successfully",
        data: rows,
      });
    });

    app.delete("/tasks/:id", isLogin, async (req, res) => {
      const { id } = req.params;

      await db.execute(`DELETE FROM tasks WHERE id = ?`, [id]);

      res.status(200).json({
        message: "Task deleted successfully",
      });
    });

    //Add to db

    //2. create a db

    // const result = await db.execute(`CREATE DATABASE BlysIntern`);

    // console.log(await db.execute("show databases"));

    //3. we create the table

    //  await db.execute(`CREATE TABLE BlysIntern.tasks(
    //     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //     title VARCHAR(255) NOT NULL,
    //     description VARCHAR(255) NOT NULL

    // )`);

    //! Insert into table(Not Recommened) using inline
    // await db.execute(`INSERT INTO users (username, email, password) VALUES("prakash", "prakash123567891123@gmail.com","123456")`);

    //! Uisng Prepared statements(single insertion)
    //   await db.execute(`INSERT INTO tasks (title, description) VALUES(?,?)`,["ReactLogin", "Madeuysiongtailwindcss"]);

    // const values = [

    //     ["prashraya", "prashraya33333334411@gmail.com","12234"],
    //     ["pralaya", "pralaya11114444@gmail.com","123456"],

    // ]

    // await db.query("insert into users(username, email, password) values ?", [values]);

    // const [rows1] =  await db.execute(`Select * from users where username = "prakash"`);

    // console.log(rows1);

    //!Read From Table

    //    const [rows] =  await db.execute(`Select * from users`);

    //    console.log(rows);

    //!Delete from table

    // const [rows] = await db.execute(`DELETE FROM users WHERE username = "prakash"`);

    //  console.log(rows);

    //  const [users] = await db.execute(`select * from users`);

    //  console.log(users);
  } catch (error) {
    console.log("Error connecting to mysql db", error);
  }
}

// 2. we need to create a db;

setupDatabase();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// PostUser
