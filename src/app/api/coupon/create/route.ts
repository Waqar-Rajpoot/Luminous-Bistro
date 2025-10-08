import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon.model';
import { z } from 'zod';

// Zod schema for input validation
const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required.').trim(),
  type: z.enum(['fixed', 'percent']),
  value: z.number().min(0, 'Value must be a positive number.'),
  expiryDate: z.string().optional().refine((val) => {
    if (val && !isNaN(new Date(val).getTime())) {
      return true;
    }
    return !val;
  }, { message: 'Invalid date format.' }),
});

export async function POST(request) {
  let body;
  try {
    // Attempt to parse the request body as JSON.
    body = await request.json();
  } catch (error) {
    // If parsing fails (e.g., empty or invalid JSON), return a specific error.
    return NextResponse.json({ message: "Invalid JSON in request body." }, { status: 400 });
  }

  try {
    await dbConnect();

    // Validate the request body
    const validatedData = couponSchema.parse(body);

    // Correctly handle the value for percentage coupons by converting it to a decimal
    const finalValue = validatedData.type === 'percent' 
                       ? validatedData.value / 100 
                       : validatedData.value;

    // Check if a coupon with the same code already exists
    const existingCoupon = await Coupon.findOne({ code: validatedData.code });
    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Coupon with this code already exists.' },
        { status: 409 }
      );
    }

    // Create a new coupon document
    const newCoupon = new Coupon({
      code: validatedData.code,
      type: validatedData.type,
      value: finalValue,
      expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
    });

    // Save the coupon to the database
    await newCoupon.save();

    return NextResponse.json(
      { message: 'Coupon created successfully.', coupon: newCoupon },
      { status: 201 }
    );
  } catch (error) {
    console.error("Coupon creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed.', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
