import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon.model';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all coupons from the database
    const coupons = await Coupon.find({});

    return NextResponse.json(
      { success: true, message: 'Coupons retrieved successfully.', coupons },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while retrieving coupons." },
      { status: 500 }
    );
  }
}
