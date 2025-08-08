export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageSrc: string;
  description: string;
  isAvailable: boolean;
}

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this product."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price for this product."],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category for this product."],
    },
    imageSrc: {
      type: String,
      required: [true, "Please provide an image source for this product."],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
