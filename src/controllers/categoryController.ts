import Category from "../models/categoryModel.ts";

class CategoryController {
  categoryData = [
    {
      categoryName: "Living Room",
    },
    {
      categoryName: "Bed Room",
    },
    {
      categoryName: "Dining Room",
    },
  ];

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();

    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already seeded");
    }
  }
}

export default new CategoryController();