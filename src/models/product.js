import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("product", productSchema);
