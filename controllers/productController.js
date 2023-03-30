const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Get all products
router.get("/", async (req, res) => {
  const PAGE_SIZE = 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const products = await Product.find()
      .skip(skip)
      .limit(PAGE_SIZE)
      .populate("category", "name");

    const count = await Product.countDocuments();

    res.render("product/index", {
      products,
      current: page,
      pages: Math.ceil(count / PAGE_SIZE),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (product) {
      res.render("product/show", { product });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get form to create new product
router.get("/new", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("product/new", { categories });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Create new product
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  });
  try {
    const newProduct = await product.save();
    res.redirect(`/products/${newProduct.id}`);
  } catch (err) {
    const categories = await Category.find();
    res.render("product/new", { product, categories, error: err.message });
  }
});

// Get form to edit product
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    if (product) {
      res.render("product/edit", { product, categories });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Update product
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    });
    res.redirect(`/products/${product.id}`);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
