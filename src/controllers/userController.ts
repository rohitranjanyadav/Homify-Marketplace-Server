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
      password: bcrypt.hashSync(password, 10),
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  }

  static async login(req: Request, res: Response) {
    // Accept incoming data
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    // Check if email exists
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    // If email exists only, verify password
    if (!user) {
      res.status(404).json({
        message: "No user found with that email",
      });
    } else {
      const isEqual = bcrypt.compareSync(password, user.password);
      if (!isEqual) {
        res.status(400).json({
          message: "Invalid credentials",
        });
      } else {
        res.status(200).json({
          message: "Logged in",
        });
      }
    }
  }
}

export default UserController;
