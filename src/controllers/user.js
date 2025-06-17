import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import jsonWebToken from "jsonwebtoken";

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
      .json({ message: "User provided data is wrong ( password)" });
  }
  console.log("logged in");

  const token = jsonWebToken.sign(
    { userEmail: user.email, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
  return res
    .status(200)
    .json({ message: "User logged in successfuly", jsonWebToken: token }); //uz cryptinam info
};

export const GET_ALL = async (req, res) => {
  const users = await UserModel.find().select("-password -createdAt -__v");

  res.status(200).json({
    users: users,
  });
};

export const UPDATE_BY_ID = (req, res) => {};

export const DELETE_BY_ID = (req, res) => {};
