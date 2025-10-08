import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon.model';
import { z } from 'zod';

const updateSchema = z.object({
  id: z.string(),
  code: z.string().min(1).trim(),
  type: z.enum(['fixed', 'percent']),
  value: z.coerce.number().min(0),
  expiryDate: z.string().optional(),
});

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    const validatedData = updateSchema.safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data provided.',
        errors: validatedData.error.errors,
      }, { status: 400 });
    }

    const { id, ...updateFields } = validatedData.data;
    
    // Find the coupon by its ID and update it
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // Return the updated document and run Mongoose validators
    );

    if (!updatedCoupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Coupon updated successfully.', coupon: updatedCoupon },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while updating the coupon." },
      { status: 500 }
    );
  }
}
