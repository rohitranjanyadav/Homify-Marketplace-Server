import type { Request, Response } from "express";
import Order from "../database/models/orderModel.ts";
import OrderDetails from "../database/models/orderDetails.ts";
import { PaymentMethod } from "../globals/types/index.ts";
import Payment from "../database/models/paymentModel.ts";

interface IProduct {
  productId: string;
  productQty: string;
}

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    const userId = req.user?.id;

    const { phoneNumber, shippingAddress, totalAmount, paymentMethod } =
      req.body;
    const products: IProduct[] = req.body.products;

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      products.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber, shippingAddress, totalAmount, products",
      });
      return;
    }

    // Order
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
    });
    // console.log("Order Data: ", orderData);
    // console.log("products: ", products);

    // Order Details
    products.forEach(async function (product) {
      await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });
    });

    // Payment
    if (paymentMethod == PaymentMethod.COD) {
      await Payment.create({
        orderId: orderData.id,
        paymentMethod: paymentMethod,
      });
    } else if (paymentMethod == PaymentMethod.Khalti) {
    } else {
    }

    res.status(201).json({
      message: "Order created successfully",
    });
  }
}

export default new OrderController();
