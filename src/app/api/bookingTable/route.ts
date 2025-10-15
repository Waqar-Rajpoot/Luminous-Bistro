import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { bookingSchema } from "@/schemas/bookingSchema";
import { z } from "zod";
import BookingModel from "@/models/Booking.model";
import { ErrorResponse } from "@/utils/ErrorResponse"; // Assuming you have this

interface SuccessResponse {
  success: boolean;
  message: string;
  booking?: any;
  bookings?: any[]; // Added for GET response
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    console.log("Booking Data:", body);


    const validatedData = bookingSchema.parse(body);

    // When a new booking is created, it's initially not confirmed
    const newBooking = await BookingModel.create({ ...validatedData, isConfirmed: "pending" });

    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        message: "Table booked successfully! Awaiting confirmation.",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: `Validation error: ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    console.error("Error booking table:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "Internal server error. Could not book table.",
      },
      { status: 500 }
    );
  }
}

// NEW: GET endpoint to fetch all bookings
export async function GET() {
  await dbConnect();

  try {
    // Fetch all bookings, sorted by creation date (newest first)
    const bookings = await BookingModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        message: "Bookings fetched successfully!",
        bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "Internal server error. Could not fetch bookings.",
      },
      { status: 500 }
    );
  }
}