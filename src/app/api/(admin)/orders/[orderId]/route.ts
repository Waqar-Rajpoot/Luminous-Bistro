// import { NextResponse } from "next/server";
// import Order from "@/models/Order.model";
// import dbConnect from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// // PATCH: Update an existing order's status
// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;
//   try {
//     // Connect to the database
//     await dbConnect();

//      const session = await getServerSession(authOptions);
//       if (!session || session.user?.role !== 'admin') {
//         return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//       }
//     // Parse the request body to get the new status
//     const { orderStatus } = await request.json();

//     // Find the order by ID and update its status
//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { orderStatus },
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedOrder);
//   } catch (error) {
//     console.error("API PATCH error:", error);
//     return NextResponse.json(
//       { error: "Failed to update order" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: Delete an order by its ID
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;
//   try {
//     // Connect to the database
//     await dbConnect();

//      const session = await getServerSession(authOptions);
//       if (!session || session.user?.role !== 'admin') {
//         return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//       }
//     // Find and delete the order by its ID
//     const deletedOrder = await Order.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("API DELETE error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete order" },
//       { status: 500 }
//     );
//   }
// }




// app/api/orders/[orderId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order.model';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    await dbConnect();
    const { orderId } = params;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }

    // Ensure _id is mapped to id for frontend consistency if needed
    const serializedOrder = {
      ...order,
      _id: order._id.toString(), // Convert ObjectId to string
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      expiresAt: order.expiresAt ? order.expiresAt.toISOString() : undefined, // If applicable
      items: order.items.map(item => ({
        ...item,
        _id: item._id.toString(),
      })),
    };


    return NextResponse.json(serializedOrder, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data.", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

