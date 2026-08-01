import type { Request, Response } from "express";
import Cart from "../database/models/cartModel.ts";
import Product from "../database/models/productModel.ts";
import Category from "../database/models/categoryModel.ts";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

class CartController {
  async addToCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400).json({
        message: "Please provide productId and quantity",
      });
      return;
    }

    let itemInUserCart = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (itemInUserCart) {
      itemInUserCart.quantity = itemInUserCart.quantity + quantity;
      itemInUserCart.save();
    } else {
      Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    const cartData = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Product added to Cart",
      data: cartData,
    });
  }

  async getMyCartItems(req: AuthRequest, res: Response) {
    const userId = req.user?.id;

    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productPrice", "productImageUrl"],
        },
      ],
    });

    if (cartItems.length === 0) {
      res.status(404).json({
        message: "Cart is empty",
      });
    } else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItems,
      });
    }
  }

  async deleteMyCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;

    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({
        message: "No product with that ID",
      });
      return;
    }

    await Cart.destroy({
      where: {
        productId,
        userId,
      },
    });

    res.status(200).json({
      message: "Product from cart deleted successfully",
    });
  }

  async updateCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      res.status(400).json({
        message: "Please provide quantity",
      });
      return;
    }

    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem) {
      res.status(404).json({
        message: "Cart doesn't have the product with that productId",
      });
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json({
        message: "Cart updated",
      });
    }
  }
}

export default new CartController();
