import adminSeeder from "./adminSeeder.ts";
import app from "./src/app.ts";
import { envConfig } from "./src/config/config.ts";
import { dbInitialized } from "./src/database/connection.ts";
import categoryController from "./src/controllers/categoryController.ts";

async function startServer() {
  try {
    await dbInitialized;
    
    const port = envConfig.port || 4000;
    app.listen(port, () => {
      categoryController.seedCategory();
      console.log(`Server has started at PORT[${port}]`);
      adminSeeder();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
