// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactMessageModel, { IContactMessage } from '@/models/ContactMessage.model'; // Import IContactMessage
import { contactSchema } from '@/schemas/contactSchema';
import { z } from 'zod';
import { ErrorResponse } from '@/utils/ErrorResponse';

interface SuccessResponse {
  success: boolean;
  message: string;
  contactMessage?: IContactMessage;
  contactMessages?: IContactMessage[]; // For multiple messages
}

// --- POST (Already existing, ensure it sets isRead to false by default) ---
export async function POST(request: Request) {
  await dbConnect();

  try {

    console.log("Received contact message request");
    const body = await request.json();

    console.log("Contact Data:", body);

    const validatedData = contactSchema.parse(body);

    const newContactMessage = await ContactMessageModel.create(validatedData);

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contactMessage: newContactMessage,
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ');
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: `Validation error: ${errorMessage}`,
      }, { status: 400 });
    }

    console.error("Error sending contact message:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not send message.',
    }, { status: 500 });
  }
}

// --- GET (Fetch all messages for admin panel) ---
export async function GET() {
  await dbConnect();
console.log("Fetching contact messages...");
  try {
    const contactMessages = await ContactMessageModel.find({}).sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Contact messages fetched successfully.',
      contactMessages,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not fetch contact messages.',
    }, { status: 500 });
  }
}