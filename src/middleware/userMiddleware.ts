import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.ts";

class UserMiddleware {
  async isUserLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Receive Token
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      res.status(403).json({
        message: "Token must be provided",
      });
      return;
    }

    // Validate the Token
    jwt.verify(token, envConfig.jwtSecretKey as string, async (err, result) => {
      if (err) {
        res.status(403).json({
          message: "Invalid Token!!!",
        });
      } else {
        console.log(result);
        next();
      }
    });
  }
}

export default new UserMiddleware();
