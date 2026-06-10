import type { Request, Response } from "express";
import User from "../models/userModel.ts";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken.ts";
import generateOtp from "../services/generateOtp.ts";
import sendMail from "../services/sendMail.ts";
import findData from "../services/findData.ts";

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

    await sendMail({
      to: email,
      subject: "Registration Succeccfull on Homify",
      text: "Thank you for joining Homify-Ecommerce",
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
        const token = generateToken(user.id);

        res.status(200).json({
          message: "Logged in",
          token: token,
        });
      }
    }
  }

  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Please provide email" });

    const user = await findData(User, email);

    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = generateOtp();

    await sendMail({
      to: email,
      subject: "Homify-Ecommerce Password Change Request",
      text: `You requested to reset your password. The OTP is ${otp}`,
    });

    user.otp = otp.toString();
    user.otpGeneratedTime = Date.now().toString();
    await user.save();

    res.status(200).json({
      message: "Password Reset OTP sent!!!",
    });
  }
}

export default UserController;
