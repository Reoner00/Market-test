import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import Product from "../models/product.js";
import jsonWebToken from "jsonwebtoken";
import mongoose from "mongoose";

export const INSERT_USER = async (req, res) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    return res
      .status(400)
      .json({ message: "First name, email, and password are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date(),
      password: passwordHash,
    };

    const response = new UserModel(newUser);
    const data = await response.save();

    res.status(201).json({ message: "user was created", user: data });
  } catch (err) {
    // Обработка ошибок
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};

export const LOGIN_USER = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "User provided data is wrong" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "User provided data is wrong (password)" });
    }
    console.log("logged in");

    const token = jsonWebToken.sign(
      { userEmail: user.email, userId: user._id },

      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    return res
      .status(200)
      .json({ message: "User logged in successfuly", jsonWebToken: token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error during login",
      error: err.message,
    });
  } //crypt info
};

export const GET_ALL = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.userId });
    return res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const SAVE_PRODUCT_TO_USER = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.saveProductUser.includes(productId)) {
      user.saveProductUser.push(productId);
      await user.save();
    }
    const updatedUser = await UserModel.findById(userId)
      .select("-password")
      .populate("saveProductUser");

    res.status(200).json({
      message: "Product added to user",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding product to user",
      error: err.message,
    });
  }
};

export const GET_USER_WITH_PRODUCTS = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          $from: "products",
          localfield: "saveProductUser",
          foreignField: "_id",
          as: "savedProducts",
        },
      },
      {
        $project: {
          password: 0,
          createdAt: 0,
          __v: 0,
        },
      },
      { $limit: 1 },
    ]);
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
export const GET_USER_BY_ID = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);

    const user = await UserModel.findOne({ id: userId })
      .populate({
        path: "saveProductUser",
        localField: "saveProductUser",
        foreignField: "_id",
        as: "savedProducts",
      })
      .select("-password -createdAt -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
export const GET_MY_PROFILE = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId)
      .populate("saveProductUser", "-__v -createdAt")
      .select("-password -createdAt -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

export const UPDATE_BY_ID = (req, res) => {};

export const DELETE_BY_ID = (req, res) => {};
