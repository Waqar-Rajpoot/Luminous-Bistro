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





import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

// Import your Mongoose models
import Order from "@/models/Order.model";
import Booking from "@/models/Booking.model";
import Review from "@/models/Review.model";
import Message from "@/models/ContactMessage.model";

// Update the function signature to accept 'params' from the dynamic route
export async function GET(request, { params }) {
  console.log("API Request received");
  
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

    // 1. Calculate the cutoff time for the last 24 hours.
    // Date.now() in milliseconds - (24 hours * 60 min * 60 sec * 1000 ms)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log(`24-hour cutoff time: ${twentyFourHoursAgo.toISOString()}`);

    // 2. Execute all necessary queries concurrently using Promise.all
    const [user, latestOrders, latestBookings, recentBookings, reviews, messages, recentOrders] = await Promise.all([
      // 1. User details
      User.findOne({ _id: userId }).lean(),
      
      // 2. Latest 10 Orders (standard query for user history)
      Order.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      
      // 3. Latest 10 Bookings
      Booking.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),

      Booking.find({
        userId: userId,
        createdAt: { $gte: twentyFourHoursAgo } // Filter: Greater Than or Equal to 24 hours ago
      }).sort({ createdAt: -1 }).lean(),
      
      // 4. Latest 10 Reviews (assuming Review model uses userId field for ownership)
      Review.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      
      // 5. Latest 10 Messages
      Message.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      
      // 6. NEW: Orders placed in the LAST 24 HOURS
      Order.find({
        userId: userId,
        createdAt: { $gte: twentyFourHoursAgo } // Filter: Greater Than or Equal to 24 hours ago
      }).sort({ createdAt: -1 }).lean(), // Sort by newest first
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log(recentOrders.length, "orders found in the last 24 hours");

    // 3. Return the combined data
    return NextResponse.json({
      user,
      latestOrders, // Renamed from 'orders' for clarity (last 10 items)
      recentOrders, // NEW: All orders from the last 24 hours
      latestBookings,
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
