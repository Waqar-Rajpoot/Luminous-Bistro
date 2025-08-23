// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReviewModel, { IReview } from '@/models/Review.model'; // Import IReview
import { reviewSchema } from '@/schemas/reviewSchema';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
// Define interfaces for consistent responses
interface SuccessResponse {
  success: boolean;
  message: string;
  review?: IReview; // Use IReview for specific review
  reviews?: IReview[]; // For multiple reviews
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// --- POST (Already existing, ensure it sets isApproved to false by default) ---
export async function POST(request: Request) {
  await dbConnect();
   const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

  try {
    const body = await request.json();

    // The reviewSchema should have a default of false for isApproved
    const validatedData = reviewSchema.parse(body);

    const newReview = await ReviewModel.create(validatedData);

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Thank you for your review! It will be published after moderation.',
      review: newReview,
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ');
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: `Validation error: ${errorMessage}`,
      }, { status: 400 });
    }

    console.error("Error submitting review:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not submit review.',
    }, { status: 500 });
  }
}

// --- GET (Fetch all reviews for admin panel) ---
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reviews = await ReviewModel.find({}).sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Reviews fetched successfully.',
      reviews,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not fetch reviews.',
    }, { status: 500 });
  }
}