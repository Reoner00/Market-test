import Product from "../models/product.js";

export const GET_ALL = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.userId });

    return res.status(200).json({
      products: products,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const GET_BY_ID = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const GET_SORTED = async (req, res) => {
  try {
    const sortedProduct = await Product.find().sort({ price: -1 });
    res.json(sortedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const INSERT = async (req, res) => {
  const { name, imageUrl, description, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  try {
    const product = new Product({
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date(),
    });

    const data = await product.save();

    return res.status(201).json({
      message: "product was added",
      product: data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

export const UPDATE_BY_ID = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const DELETE_BY_ID = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};
