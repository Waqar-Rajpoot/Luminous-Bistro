// // lib/models/Order.js
// import mongoose, { Document, Schema } from "mongoose";

// // Define the TypeScript interface for a single item in the order
// export interface IOrderItem {
//   name: string;
//   price: number;
//   quantity: number;
// }

// export interface IOrder extends Document {
//   stripeSessionId: string;
//   customerEmail: string;
//   customerName?: string;
//   totalAmount: number;
//   currency: string;
//   orderStatus: "pending" | "paid" | "fulfilled";
//   items: IOrderItem[];
//   createdAt: Date;
// }

// // Define the schema for a single item in the order
// const OrderItemSchema: Schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true },
// });

// // Define the main Order schema
// const OrderSchema: Schema<IOrder> = new mongoose.Schema({
//   // Use the Stripe session ID as the unique order identifier
//   stripeSessionId: { type: String, required: true, unique: true },
//   customerEmail: { type: String, required: true },
//   customerName: { type: String },
//   totalAmount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   orderStatus: {
//     type: String,
//     enum: ["pending", "paid", "fulfilled"],
//     default: "paid",
//   },
//   items: [OrderItemSchema],
//   createdAt: { type: Date, default: Date.now },
// }, {
//   timestamps: true
// });

// const Order =
//   mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

// export default Order;








// import mongoose, { Document, Schema } from 'mongoose';

// // Define the TypeScript interface for a single item in the order
// export interface IOrderItem {
//   id: string; // Product ID
//   name: string;
//   price: number;
//   quantity: number;
//   image: string; // Product image
// }

// // Define the TypeScript interface for the shipping address
// export interface IShippingAddress {
//   fullName: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   phoneNumber: string;
// }

// // Define the TypeScript interface for the applied coupon
// export interface IAppliedCoupon {
//   code: string;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number;
//   appliedDiscount: number; // Actual discount applied to this order
// }

// // Define the main TypeScript interface for the Order document
// export interface IOrder extends Document {
//   stripeSessionId?: string; // Will be set after Stripe checkout
//   orderId: string; // Our internal unique order ID
//   userId?: string; // Optional: if you have user authentication
//   customerEmail: string;
//   customerName?: string;
//   totalAmount: number; // Original total before discount
//   discountAmount: number; // Actual discount applied
//   finalAmount: number; // Final amount after discount
//   currency: string;
//   orderStatus: 'pending' | 'paid' | 'fulfilled' | 'canceled';
//   items: IOrderItem[];
//   shippingAddress: IShippingAddress;
//   appliedCoupon?: IAppliedCoupon; // Optional applied coupon
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Define the schema for a single item in the order
// const OrderItemSchema: Schema = new mongoose.Schema({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true },
//   image: { type: String, required: true },
// });

// // Define the schema for the shipping address
// const ShippingAddressSchema: Schema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   addressLine1: { type: String, required: true },
//   addressLine2: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, required: true, default: 'Pakistan' },
//   phoneNumber: { type: String, required: true },
// });

// // Define the schema for the applied coupon
// const AppliedCouponSchema: Schema = new mongoose.Schema({
//   code: { type: String, required: true },
//   discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
//   discountValue: { type: Number, required: true },
//   appliedDiscount: { type: Number, required: true },
// });

// // Define the main Order schema
// const OrderSchema: Schema<IOrder> = new mongoose.Schema({
//   stripeSessionId: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls if not set initially
//   orderId: { type: String, required: true, unique: true }, // Our internal order ID
//   userId: { type: String }, // For authenticated users
//   customerEmail: { type: String, required: true },
//   customerName: { type: String },
//   totalAmount: { type: Number, required: true }, // Original total before discount
//   discountAmount: { type: Number, default: 0 }, // Actual discount applied
//   finalAmount: { type: Number, required: true }, // Final amount after discount
//   currency: { type: String, required: true, default: 'pkr' },
//   orderStatus: { type: String, enum: ['pending', 'paid', 'fulfilled', 'canceled'], default: 'pending' }, // Set to pending initially
//   items: { type: [OrderItemSchema], required: true },
//   shippingAddress: { type: ShippingAddressSchema, required: true },
//   appliedCoupon: { type: AppliedCouponSchema },
// }, {
//   timestamps: true,
// });

// const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// export default Order;






// import mongoose, { Document, Schema } from 'mongoose';

// // Ensure you have a User model defined for this reference to work correctly
// // import User from './User.model'; // Example: if your User model is in User.model.js

// export interface IOrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export interface IShippingAddress {
//   fullName: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   phoneNumber: string;
// }

// export interface IAppliedCoupon {
//   code: string;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number;
//   appliedDiscount: number;
// }

// export interface IOrder extends Document {
//   stripeSessionId?: string;
//   orderId: string;
//   userId: mongoose.Types.ObjectId; // Changed to ObjectId and is now required
//   customerEmail: string;
//   customerName?: string;
//   totalAmount: number;
//   discountAmount: number;
//   finalAmount: number;
//   currency: string;
//   orderStatus: 'pending' | 'paid' | 'fulfilled' | 'canceled';
//   items: IOrderItem[];
//   shippingAddress: IShippingAddress;
//   appliedCoupon?: IAppliedCoupon;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OrderItemSchema: Schema = new mongoose.Schema({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true },
//   image: { type: String, required: true },
// });

// const ShippingAddressSchema: Schema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   addressLine1: { type: String, required: true },
//   addressLine2: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, required: true, default: 'Pakistan' },
//   phoneNumber: { type: String, required: true },
// });

// const AppliedCouponSchema: Schema = new mongoose.Schema({
//   code: { type: String, required: true },
//   discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
//   discountValue: { type: Number, required: true },
//   appliedDiscount: { type: Number, required: true },
// });

// const OrderSchema: Schema<IOrder> = new mongoose.Schema({
//   stripeSessionId: { type: String },
//   orderId: { type: String, required: true, unique: true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   customerEmail: { type: String, required: true },
//   customerName: { type: String },
//   totalAmount: { type: Number, required: true },
//   discountAmount: { type: Number, default: 0 },
//   finalAmount: { type: Number, required: true },
//   currency: { type: String, required: true, default: 'pkr' },
//   orderStatus: { type: String, enum: ['pending', 'paid', 'fulfilled', 'canceled'], default: 'pending' },
//   items: { type: [OrderItemSchema], required: true },
//   shippingAddress: { type: ShippingAddressSchema, required: true },
//   appliedCoupon: { type: AppliedCouponSchema },
// }, {
//   timestamps: true,
// });

// const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// export default Order;







import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  finalPrice?: number;
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface IOrder extends Document {
  stripeSessionId?: string;
  orderId: string;
  userId: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  orderStatus: 'pending' | 'paid' | 'fulfilled' | 'canceled';
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  finalPrice: { type: Number },
});

const ShippingAddressSchema: Schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Pakistan' },
  phoneNumber: { type: String, required: true },
});

const OrderSchema: Schema<IOrder> = new mongoose.Schema({
  stripeSessionId: { type: String },
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String },
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'pkr' },
  orderStatus: { type: String, enum: ['pending', 'paid', 'fulfilled', 'canceled'], default: 'pending' },
  items: { type: [OrderItemSchema], required: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
