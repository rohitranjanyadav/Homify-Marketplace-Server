import type { Request, Response } from "express";
import Product from "../models/productModel.ts";
import Category from "../models/categoryModel.ts";

interface IProductRequest extends Request {
  file?: {
    filename: string;
  };
}

class ProductController {
  async createProduct(req: IProductRequest, res: Response): Promise<void> {
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId,
    } = req.body;

    const filename = req.file
      ? req.file.filename
      : "https://agrimart.in/uploads/vendor_banner_image/default.jpg";

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock ||
      !discount ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName,productDescription,productPrice,productTotalStock,discount",
      });
      return;
    }

    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId,
      productImageUrl: filename,
    });

    res.status(200).json({
      message: "Product Created Successfully",
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const datas = await Product.findAll({
      include: [
        {
          model: Category,
        },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data: datas,
    });
  }

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const data = await Product.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: Category,
        },
      ],
    });

    res.status(200).json({
      message: "Products fetched successfully",
      data: data,
    });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const data = await Product.findAll({
      where: {
        id: id,
      },
    });

    if (data.length === 0) {
      res.status(404).json({
        message: "No Product with That ID",
      });
    } else {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
        data: data,
      });
    }
  }
}

export default new ProductController();
