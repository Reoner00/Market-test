import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import productRoutes from "./src/routes/product.js";
import userRoutes from "./src/routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3003;
const MONGO_URI =
  "mongodb+srv://Reoner:123@clustershop.ixsjxcp.mongodb.net/shop?retryWrites=true&w=majority";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//TODO : add real ui url
app.use(cors());

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/users", userRoutes);
app.use("/product", productRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "ok" });
});

app.use((_req, res) => {
  return res.status(400).json({
    message: "This endpoit does not exist",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
