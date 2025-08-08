import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. TypeScript Interface for a Menu Document
export interface IMenu extends Document {
  category: string;
  p1name: string;
  p1price: number;
  p2name: string;
  p2price: number;
  p3name: string;
  p3price: number;
  p4name: string;
  p4price: number;
  imageSrc: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const MenuSchema: Schema<IMenu> = new Schema({
  category: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true, // Assuming category names should be unique for menus
    trim: true,
  },
  p1name: {
    type: String,
    required: [true, 'Product 1 name is required.'],
    trim: true,
  },
  p1price: {
    type: Number,
    required: [true, 'Product 1 price is required.'],
    min: [0.01, 'Product 1 price must be greater than 0.'],
  },
  p2name: {
    type: String,
    required: [true, 'Product 2 name is required.'],
    trim: true,
  },
  p2price: {
    type: Number,
    required: [true, 'Product 2 price is required.'],
    min: [0.01, 'Product 2 price must be greater than 0.'],
  },
  p3name: {
    type: String,
    required: [true, 'Product 3 name is required.'],
    trim: true,
  },
  p3price: {
    type: Number,
    required: [true, 'Product 3 price is required.'],
    min: [0.01, 'Product 3 price must be greater than 0.'],
  },
  p4name: {
    type: String,
    required: [true, 'Product 4 name is required.'],
    trim: true,
  },
  p4price: {
    type: Number,
    required: [true, 'Product 4 price is required.'],
    min: [0.01, 'Product 4 price must be greater than 0.'],
  },
  imageSrc: {
    type: String,
    required: [true, 'Menu image URL is required.'],
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/, 'Please provide a valid image URL.'], // Basic URL validation
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// 3. Create and Export the Mongoose Model
// Check if the model already exists to prevent OverwriteModelError
const Menu: Model<IMenu> = mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;