// lib/models/Order.js
import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for a single item in the order
export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  stripeSessionId: string;
  customerEmail: string;
  customerName?: string;
  totalAmount: number;
  currency: string;
  orderStatus: "pending" | "paid" | "fulfilled";
  items: IOrderItem[];
  createdAt: Date;
}

// Define the schema for a single item in the order
const OrderItemSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Define the main Order schema
const OrderSchema: Schema<IOrder> = new mongoose.Schema({
  // Use the Stripe session ID as the unique order identifier
  stripeSessionId: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String },
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  orderStatus: {
    type: String,
    enum: ["pending", "paid", "fulfilled"],
    default: "paid",
  },
  items: [OrderItemSchema],
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
