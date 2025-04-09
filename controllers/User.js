
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../db/connectDb.js";

const UserRegisterController = async (req, res) => {
  try {
   const db =  await connectDB();
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
  } catch (error) {
    console.log(error);
  }
};

const userLoginController = async (req, res) => {
  try {
    const db =  await connectDB();

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
  } catch (error) {
    console.log(error);
  }
};



const userProfileController = async(req, res) =>{

    try{

        const db =  await connectDB();
        const [user] = await db.execute(`SELECT * FROM users WHERE id = ?`, [
          req.user_id,
        ]);
  
        console.log(user[0]);
  
        res.json({ message: "Access granted", LoggedInUserInfo: user[0] });

      }catch(error){

        console.log(error);
        
      }



}




const userLogoutController = (req, res) =>{

    res.clearCookie("authToken");

    res.status(200).json({
        message: "User logged out successfully",
      });

}

export { UserRegisterController, userLoginController , userProfileController , userLogoutController};
