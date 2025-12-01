import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; 
import SupportThread from "@/models/SupportThread.model"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// --- GET: Fetch Message History (Polling) ---
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user._id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const thread = await SupportThread.findOne({ userId });

    if (!thread) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const sortedMessages = thread.messages.sort(
      (a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    return NextResponse.json({ messages: sortedMessages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat thread:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- POST: Send a New Message ---
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  try {
    const body = await request.json();
    const { text } = body;

    const session = await getServerSession(authOptions);
    if (!session || session.user._id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { message: "Message text is required" },
        { status: 400 }
      );
    }

    const newMessage = {
      senderId: userId,
      senderRole: "user",
      text: text,
      createdAt: new Date(),
    };

    const thread = await SupportThread.findOneAndUpdate(
      { userId: userId },
      {
        $push: { messages: newMessage },
        $set: { updatedAt: new Date() },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "Message sent successfully", threadId: thread._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
