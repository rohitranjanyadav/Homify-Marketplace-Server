import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.ts";
import User from "../models/userModel.ts";

const sequelize = new Sequelize(envConfig.connectionString as string, {
  dialect: "postgres",
});

sequelize.addModels([User]);
console.log(sequelize.models)

try {
  sequelize
    .authenticate()
    .then(() => console.log("Authenticated"))
    .catch((err) => console.log("Error authenticating", err));
} catch (error) {
  console.log(error);
}

sequelize.sync({ force: false }).then(() => {
  console.log("Local changes injected to Database successfully");
});

export default sequelize;
