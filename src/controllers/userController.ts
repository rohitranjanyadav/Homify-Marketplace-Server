import type { Request, Response } from "express";
import User from "../models/userModel.ts";
import bcrypt from "bcrypt";

class UserController {
  static async register(req: Request, res: Response) {
    // Receive incoming user data
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide all details",
      });
      return;
    }

    // Register user data to table
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password,10),
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  }
}

export default UserController;
