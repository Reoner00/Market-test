import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

export default mongoose.model("product", productSchema);
