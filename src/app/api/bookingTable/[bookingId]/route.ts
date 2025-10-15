import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BookingModel from "@/models/Booking.model";
import { ErrorResponse } from "@/utils/ErrorResponse"; // Assuming you have this
import mongoose from "mongoose"; // Import mongoose to validate ObjectId

interface SuccessResponse {
  success: boolean;
  message: string;
  booking?: any;
}

// PATCH endpoint to update a specific booking's status
export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  await dbConnect();
  const { bookingId } = await params;

  // Basic validation for ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return NextResponse.json<ErrorResponse>(
      { success: false, message: "Invalid booking ID." },
      { status: 400 }
    );
  }

  try {
    const { isConfirmed } = await request.json();

    // Ensure isConfirmed is a boolean
    // if (typeof isConfirmed !== 'boolean') {
    //   return NextResponse.json<ErrorResponse>(
    //     { success: false, message: "Invalid 'isConfirmed' status provided." },
    //     { status: 400 }
    //   );
    // }

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { isConfirmed },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return NextResponse.json<ErrorResponse>(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    const statusMessage = updatedBooking.isConfirmed === "confirmed" ? "confirmed" : updatedBooking.isConfirmed === "canceled" ? "canceled" : "set to pending";
    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        message: `Booking ${statusMessage} successfully!`,
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "Internal server error. Could not update booking status.",
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific booking
export async function DELETE(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  await dbConnect();
  const { bookingId } = await params;

  // Basic validation for ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return NextResponse.json<ErrorResponse>(
      { success: false, message: "Invalid booking ID." },
      { status: 400 }
    );
  }

  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return NextResponse.json<ErrorResponse>(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        message: "Booking deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "Internal server error. Could not delete booking.",
      },
      { status: 500 }
    );
  }
}