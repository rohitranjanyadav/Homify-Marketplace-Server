import adminSeeder from "./adminSeeder.ts";
import app from "./src/app.ts";
import { envConfig } from "./src/config/config.ts";
import { dbInitialized } from "./src/database/connection.ts";
import categoryController from "./src/controllers/categoryController.ts";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/database/models/userModel.ts";

async function startServer() {
  try {
    await dbInitialized;

    const port = envConfig.port || 4000;

    const server = app.listen(port, () => {
      categoryController.seedCategory();
      console.log(`Server has started at PORT[${port}]`);
      adminSeeder();
    });

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
      },
    });

    let onlineUsers: { socketId: string; userId: string; role: string }[] = [];
    let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
      onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
      onlineUsers.push({ socketId, userId, role });
    };

    io.on("connection", (socket) => {
      const { token } = socket.handshake.auth; // JWT token

      if (token) {
        jwt.verify(
          token,
          envConfig.jwtSecretKey as string,
          async (err: any, result: any) => {
            if (err) {
              socket.emit("error", err);
            } else {
              const userData = await User.findByPk(result.userId);
              if (!userData) {
                socket.emit("error", "No user found with that userId");
                return;
              }
              addToOnlineUsers(socket.id, result.userId, userData.role);
            }
          },
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
