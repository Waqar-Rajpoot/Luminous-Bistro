import mongoose, { Schema } from 'mongoose';

// The coupon schema defines the structure of a coupon document
const couponSchema = new Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
  },
  // Type can be 'fixed' for a flat amount or 'percent' for a percentage discount
  type: {
    type: String,
    enum: ['fixed', 'percent'],
    required: [true, 'Coupon type is required'],
  },
  // The value of the discount (e.g., 20 for a fixed amount, 0.1 for a 10% discount)
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: 0,
  },
  // An optional expiration date for the coupon
  expiryDate: {
    type: Date,
    required: false,
  },
}, { timestamps: true }); // Mongoose adds createdAt and updatedAt fields automatically

// Export the Coupon model
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
