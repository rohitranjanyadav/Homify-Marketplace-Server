import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.ts";
import User from "../database/models/userModel.ts";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(
    req: IExtendedRequest,
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
    jwt.verify(
      token,
      envConfig.jwtSecretKey as string,
      async (err, result: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid Token!!!",
          });
        } else {
          const userData = await User.findByPk(result.userId);
          //  @ts-ignore
          if (!userData) {
            res.status(404).json({
              message: "No user with that userId",
            });
            return;
          }
          req.user = userData;
          next();
        }
      },
    );
  }

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      console.log(userRole, "Role");

      if (!req.user) {
        return res.status(401).json({
          message: "Please login first",
        });
      }

      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You don't have permission",
        });
        return;
      }

      next();
    };
  }
}

export default new UserMiddleware();
