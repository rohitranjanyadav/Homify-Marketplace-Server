import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.ts";
import User from "./models/userModel.ts";
import Product from "./models/productModel.ts";
import Category from "./models/categoryModel.ts";
import Order from "./models/orderModel.ts";
import OrderDetails from "./models/orderDetails.ts";
import Payment from "./models/paymentModel.ts";

const sequelize = new Sequelize(envConfig.connectionString as string, {
  dialect: "postgres",
});

sequelize.addModels([User]);
sequelize.addModels([Product]);
sequelize.addModels([Category]);
sequelize.addModels([OrderDetails]);
sequelize.addModels([Payment]);
sequelize.addModels([Order]);
console.log(sequelize.models);

try {
  sequelize
    .authenticate()
    .then(() => console.log("Authenticated"))
    .catch((err) => console.log("Error authenticating", err));
} catch (error) {
  console.log(error);
}

// alter: true --> to migrate
sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Local changes injected to Database successfully");
});

// Relationships
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });

export default sequelize;
