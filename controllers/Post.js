import { connectDB } from "../db/connectDb.js";


const PostTaskController = async (req, res) => {
  try {
   
    const db = await connectDB();

    const { title, description } = req.body;

    await db.execute(
      `INSERT INTO tasks (title, description, user_id) VALUES(?,?, ?)`,
      [title, description, req.user_id]
    );

    res.status(201).json({
      message: "Task added successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getTasksController = async (req, res) => {
  try {
    const db = await connectDB();
    console.log(req.user_id);

    const [rows] = await db.execute(`SELECT * FROM tasks WHERE user_id = ?`, [
      req.user_id,
    ]);

    res.status(200).json({
      message: "Tasks fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteTaskController = async (req, res) => {
    try {
      const db = await connectDB();
      const { id } = req.params; // task ID
      const userId = req.user_id; // assumed to be set via auth middleware
  
      const [result] = await db.execute(
        `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
        [id, userId]
      );

  
      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "You are not authorized to delete this task or task not found",
        });
      }
  
      res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export { PostTaskController, getTasksController, deleteTaskController };
