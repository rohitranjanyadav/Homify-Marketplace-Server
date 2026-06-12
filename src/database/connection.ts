import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.ts";
import User from "../models/userModel.ts";
import Product from "../models/productModel.ts";
import Category from "../models/categoryModel.ts";

const sequelize = new Sequelize(envConfig.connectionString as string, {
  dialect: "postgres",
});

sequelize.addModels([User]);
sequelize.addModels([Product]);
sequelize.addModels([Category]);
console.log(sequelize.models);

try {
  sequelize
    .authenticate()
    .then(() => console.log("Authenticated"))
    .catch((err) => console.log("Error authenticating", err));
} catch (error) {
  console.log(error);
}

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Local changes injected to Database successfully");
});

export default sequelize;
