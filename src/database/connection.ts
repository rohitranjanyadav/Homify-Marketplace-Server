import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.ts";

import path from "path";
import { fileURLToPath } from "url";

const modelsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "./models",
);

const sequelize = new Sequelize(envConfig.connectionString as string, {
  dialect: "postgres",
  models: [modelsPath],
});

try {
  sequelize
    .authenticate()
    .then(() => console.log("Authenticated"))
    .catch((err) => console.log("Error authenticating", err));
} catch (error) {
  console.log(error);
}

export default sequelize;
