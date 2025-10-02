import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    sizes: [{ type: String }],         // ["S","M","L","XL"]
    colors: [{ type: String }],        // ["Black","Blue"]
    description: { type: String },
    images: [{ type: String }],           // url
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
