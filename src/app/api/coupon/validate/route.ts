import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon.model';
import { z } from 'zod';

// Zod schema for input validation
const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required.'),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { code } = couponSchema.parse(body);

    // Find the coupon in the database
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json(
        { message: 'Invalid coupon code.' },
        { status: 404 }
      );
    }

    // Check if the coupon has expired
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { message: 'Coupon has expired.' },
        { status: 410 }
      );
    }

    // Return the valid coupon details to the client
    return NextResponse.json(
      { 
        message: 'Coupon applied successfully.',
        coupon
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
