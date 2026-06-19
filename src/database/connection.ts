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

function registerAssociations() {
  Category.hasOne(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category, { foreignKey: "categoryId" });

  // User X Order
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User, { foreignKey: "userId" });

  // Payment X Order
  Order.hasOne(Payment, { foreignKey: "orderId" });
  Payment.belongsTo(Order, { foreignKey: "orderId" });

  Order.hasOne(OrderDetails, { foreignKey: "orderId" });
  OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

  Product.hasMany(OrderDetails, { foreignKey: "productId" });
  OrderDetails.belongsTo(Product, { foreignKey: "productId" });

}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Authenticated");

    registerAssociations();

    await sequelize.sync({ force: false, alter: true });
    console.log("Local changes injected to Database successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

export const dbInitialized = initializeDatabase();

export default sequelize;
