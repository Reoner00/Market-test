import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  saveProductUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, required: true },
});

export default mongoose.model("User", userSchema); // Экспорт по умолчанию
