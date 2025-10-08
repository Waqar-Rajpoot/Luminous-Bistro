import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon.model';

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required.' },
        { status: 400 }
      );
    }

    // Find the coupon by its ID and delete it
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Coupon deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while deleting the coupon." },
      { status: 500 }
    );
  }
}
