// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options'; // Adjust this path as needed
import dbConnect from '@/lib/dbConnect'; // Adjust this path as needed
import UserModel from '@/models/User.model'; // Your User Mongoose Model
import bcrypt from 'bcryptjs'; // For password hashing

// Define response interfaces
interface SuccessResponse<T = any> { // Generic type for data
  success: boolean;
  message: string;
  data?: T; // Use 'data' for the actual payload
}

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string; // Optional detailed error message
}

// Interface for the user profile data returned
interface IUserProfileResponse {
  _id: string;
  name: string;
  username: string;
  email: string;
  address?: string;
  phone?: string;
}

// Interface for the PATCH request body
interface UpdateProfileRequestBody {
  name?: string;
  username?: string;
  email?: string; // Email changes might be restricted
  address?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// GET handler to fetch user profile
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json<ErrorResponse>({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id ;

  try {
    // Find the user by ID. Select only fields safe to return to the frontend.
    // DO NOT select password here.
    const user = await UserModel.findById({userId}).select('-password -__v'); // Exclude password hash and __v

    if (!user) {
      return NextResponse.json<ErrorResponse>({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Convert Mongoose document to plain object and ensure it matches the interface
    const userProfile: IUserProfileResponse = user.toObject();

    return NextResponse.json<SuccessResponse<IUserProfileResponse>>({
      success: true,
      message: 'User profile fetched successfully.',
      data: userProfile,
    }, { status: 200 });
  } catch (error: any) { // Catch any error and type it as 'any' for flexibility
    console.error("Error fetching user profile:", error);
    return NextResponse.json<ErrorResponse>({ success: false, message: 'Internal server error. Could not fetch profile.', error: error.message }, { status: 500 });
  }
}

// PATCH handler to update user profile
export async function PATCH(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json<ErrorResponse>({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id;
  const requestBody: UpdateProfileRequestBody = await request.json();
  const { name, username, address, phone, currentPassword, newPassword } = requestBody;

  try {
    const user = await UserModel.findById({userId});

    if (!user) {
      return NextResponse.json<ErrorResponse>({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Update basic profile fields if provided
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (address !== undefined) user.address = address;
    if (phone !== undefined) user.phone = phone;

    // Handle password change
    if (newPassword) { 
      if (!currentPassword) {
        return NextResponse.json<ErrorResponse>({ success: false, message: 'Current password is required to change password' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json<ErrorResponse>({ success: false, message: 'Incorrect current password' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json<ErrorResponse>({ success: false, message: 'New password must be at least 6 characters long' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10); // Hash the new password
    }

    await user.save();

    // Return updated user data (excluding password)
    const updatedUser: IUserProfileResponse = user.toObject();
    // Ensure sensitive fields are deleted before sending to frontend
    delete (updatedUser as any).password;
    delete (updatedUser as any).__v;

    return NextResponse.json<SuccessResponse<IUserProfileResponse>>({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedUser,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.code === 11000) { // Duplicate key error (e.g., username or email already exists)
      return NextResponse.json<ErrorResponse>({ success: false, message: 'Username or email already exists.', error: error.message }, { status: 409 });
    }
    return NextResponse.json<ErrorResponse>({ success: false, message: error.message || 'Internal server error. Could not update profile.' }, { status: 500 });
  }
}
