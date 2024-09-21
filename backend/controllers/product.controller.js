const Product = require("../models/product.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");

exports.createProduct = (req, res) => {
  const { Name, Description, Price, Category } = req.body;
  console.log("Request Body:", req.body); // Log the incoming request body

  Category.findOne({ name: Category })
    .then((foundCategory) => {
      if (!foundCategory) {
        return res.status(400).json({ message: "Category not found" });
      }

      const product = new Product({
        name: Name,
        description: Description,
        price: Price,
        category: foundCategory._id,
      });

      return product.save();
    })
    .then((product) => {
      res.status(201).json({ message: "Product successfully saved", product });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error", error: err });
    });
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.body.id;
    const data = {
      name: req.body.Name,
      description: req.body.Description,
      price: req.body.Price,
    };

    const productUpdate = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!productUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, productUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
