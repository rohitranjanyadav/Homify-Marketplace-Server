import adminSeeder from "./adminSeeder.ts";
import app from "./src/app.ts";
import { envConfig } from "./src/config/config.ts";

function startServer() {
  const port = envConfig.port || 4000;

  
  app.listen(port, () => {
    console.log(`Server has started at PORT[${port}]`);
    adminSeeder();
  });
}

startServer();
