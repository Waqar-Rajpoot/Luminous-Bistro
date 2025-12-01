// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User.model";

// // Import your Mongoose models
// import Order from "@/models/Order.model";
// import Booking from "@/models/Booking.model";
// import Review from "@/models/Review.model";
// import Message from "@/models/ContactMessage.model";

// // Update the function signature to accept 'params' from the dynamic route
// export async function GET(request: Request, { params }: { params: { userId: string } }) {
//   console.log("API Request received");
//   const { userId } = await params; // Get userId directly from the route parameters

//   console.log("User ID:", userId);

//   if (!userId) {
//     return NextResponse.json(
//       { message: "User ID is required" },
//       { status: 400 }
//     );
//   }

//   try {

//     await dbConnect();
    
//     const [user, orders, bookings, reviews, messages] = await Promise.all([
//       User.findOne({ _id: userId }),
//       Order.find({ userId: userId }).sort({ createdAt: -1 }).limit(10),
//       Booking.find({ userId: userId }).sort({ createdAt: -1 }).limit(10),
//       Review.find({ userId: userId }).sort({ createdAt: -1 }).limit(10), // no userId field in Review model
//       Message.find({ userId: userId }).sort({ createdAt: -1 }).limit(10),
//     ]);

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       user,
//       orders,
//       bookings,
//       reviews,
//       messages,
//     }, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Server error fetching dashboard data." },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

// Import your Mongoose models
import Order from "@/models/Order.model";
import Booking from "@/models/Booking.model";
import Review from "@/models/Review.model";
import Message from "@/models/ContactMessage.model";

// Update the function signature to accept 'params' from the dynamic route
export async function GET(request:NextRequest, { params }: any) {
  
  // Destructure userId from the route parameters
  const { userId } = await params;

  console.log("User ID:", userId);

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [user, allOrders, allBookings, recentBookings, reviews, messages, recentOrders] = await Promise.all([
      User.findOne({ _id: userId }).lean(),
      Order.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Booking.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Booking.find({
        userId: userId,
        createdAt: { $gte: twentyFourHoursAgo } 
      }).sort({ createdAt: -1 }).lean(),
      Review.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Message.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Order.find({
        userId: userId,
        createdAt: { $gte: twentyFourHoursAgo } 
      }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log(recentOrders.length, "orders found in the last 24 hours");

    return NextResponse.json({
      user,
      allOrders, 
      recentOrders,
      allBookings,
      recentBookings,
      reviews,
      messages,
    }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Server error fetching dashboard data." },
      { status: 500 }
    );
  }
}
