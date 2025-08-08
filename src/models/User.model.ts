import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpire: Date;
}

const UserSchema:Schema<User> = new Schema({
    username: { 
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'Username is required'] 
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], 
        required: [true, 'Email is required'], 
        unique: true 
    },
    password: { 
        type: String,
        required: [true, 'Password is required'] 
    },
    role: { 
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user' 
    },
    isVerified: { 
        type: Boolean,
        default: false 
    },
    verifyCode: { 
        type: String,
        required: [true, 'Verification code is required'] 
    },
    verifyCodeExpire: { 
        type: Date,
        required: [true, 'Verification code expiration date is required'] 
    }
}, {
    timestamps: true
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;