const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("category/index", { categories });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get single category by ID
router.get("/:id", (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        res.render("category/show", { category });
      } else {
        res.status(404).send({ message: "Category not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Get form to create new category
router.get("/new", (req, res) => {
  res.render("category/new");
});

// Create new category
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.redirect(`/categories/${newCategory.id}`);
  } catch (err) {
    res.render("category/new", { category, error: err.message });
  }
});

// Get form to edit category
router.get("/:id/edit", (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        res.render("category/edit", { category });
      } else {
        res.status(404).send({ message: "Category not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update category
router.patch("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    res.redirect(`/categories/${category.id}`);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/categories");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
