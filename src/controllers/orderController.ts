import type { Request, Response } from "express";
import Order from "../database/models/orderModel.ts";
import OrderDetails from "../database/models/orderDetails.ts";
import { PaymentMethod, PaymentStatus } from "../globals/types/index.ts";
import Payment from "../database/models/paymentModel.ts";
import axios from "axios";

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

    const paymentData = await Payment.create({
      orderId: orderData.id,
      paymentMethod: paymentMethod,
    });

    if (paymentMethod == PaymentMethod.Khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 41fe37d53ec44322905f82dd7703724f",
          },
        },
      );

      // console.log(response);

      const khaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();

      res.status(201).json({
        message: "Order created successfully",
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      });
    } else if (paymentMethod == PaymentMethod.Esewa) {
      // <-------->
    } else {
      res.status(200).json({
        message: "Order created successfully",
      });
    }
  }

  async verifyTransaction(req: OrderRequest, res: Response): Promise<void> {
    const { pidx } = req.body;

    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: "Key 41fe37d53ec44322905f82dd7703724f",
        },
      },
    );

    const data = response.data;

    if (data.status === "Completed") {
      await Payment.update(
        { paymentStatus: PaymentStatus.Paid },
        {
          where: {
            pidx: pidx,
          },
        },
      );

      res.status(200).json({
        message: "Payment verified successfully!!",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified or cancelled!!",
      });
    }
  }
}

export default new OrderController();
