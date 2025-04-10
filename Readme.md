#Project Structure

├── Routes
│   ├── users.js       # Handles user-related routes (e.g., login, register, profile)
│   ├── Post.js        # Handles task-related routes (e.g., create, update, delete tasks)
├── controllers
│   ├── User.js        # Contains logic for user-related operations (e.g., authentication)
│   ├── Task.js        # Contains logic for task-related operations
├── db
│   ├── connectDb.js   # Handles database connection logic using MySQL
├── middleware
│   ├── isLogin.js     # Middleware to check if the user is authenticated
├── .env               # Environment variables (e.g., database credentials, JWT secret)
├── index.js           # Main entry point of the application
├── package.json       # Project metadata and dependencies
├── Readme.md          # Documentation for the project



#SetUp Instruction

Make Two Table having table name users and tasks with db name as BlysIntern

users has id  , username , email and password column

tasks has id, user_id(FK), title description


Run using 

node --watch index.js

