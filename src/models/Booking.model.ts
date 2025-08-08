import mongoose, { Schema, Document } from 'mongoose';


export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  date: string; // Storing as string to match input type (YYYY-MM-DD)
  time: string; // Storing as string to match input type (HH:MM)
  guests: number;
  requests?: string; // Optional field
  isConfirmed: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}


const BookingSchema: Schema<IBooking> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: false, 
    match: [/.+@.+\..+/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  time: {
    type: String, 
    required: [true, 'Time is required'],
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Must have at least 1 guest'],
    max: [20, 'Cannot book for more than 20 guests'],
  },
  requests: {
    type: String,
    default: '',
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true 
});


const BookingModel = (mongoose.models.Booking as mongoose.Model<IBooking> || mongoose.model<IBooking>('Booking', BookingSchema))

export default BookingModel