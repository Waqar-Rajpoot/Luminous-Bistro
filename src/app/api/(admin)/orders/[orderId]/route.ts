import dbConnect from '@/lib/dbConnect'; // Your database connection function
import OrderModel from '@/models/Order.model'; // Your Mongoose Order Model


// Define the expected status types
type OrderStatus = "pending" | "paid" | "canceled";
type ShippingProgress = 'processing' | 'shipped' | 'delivered' | 'canceled';


export async function PATCH(request: Request, context: { params: { orderId: string } }) {
    try {
        console.log("PATCH request received for order update.");
        // 1. Get the order ID (assumed to be the MongoDB _id)
        const orderId = context.params.orderId;
        
        // 2. Parse the request body
        const body = await request.json();
        const { orderStatus, shippingProgress } = body;

        console.log("Order ID:", orderId);
        console.log("Order Status:", orderStatus);
        console.log("Shipping Progress:", shippingProgress);
        
        // 3. Validation
        if (!orderId) {
            return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
        }
        
        if (!orderStatus && !shippingProgress) {
            return new Response(JSON.stringify({ error: "No update fields provided. Requires 'orderStatus' or 'shippingProgress'." }), { status: 400 });
        }
        
        const updates: { [key: string]: any } = {};

        // Validate and stage orderStatus update
        if (orderStatus) {
            const validStatuses: OrderStatus[] = ["pending", "paid", "canceled"];
            if (!validStatuses.includes(orderStatus as OrderStatus)) {
                return new Response(JSON.stringify({ error: `Invalid orderStatus: ${orderStatus}` }), { status: 400 });
            }
            updates.orderStatus = orderStatus;
        }

        // Validate and stage shippingProgress update
        if (shippingProgress) {
            const validProgress: ShippingProgress[] = ["processing", "shipped", "delivered", "canceled"];
            if (!validProgress.includes(shippingProgress as ShippingProgress)) {
                return new Response(JSON.stringify({ error: `Invalid shippingProgress: ${shippingProgress}` }), { status: 400 });
            }
            updates.shippingProgress = shippingProgress;
        }

        // 4. Database Operation (using Mongoose syntax)
        await dbConnect(); // Establish a database connection

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId, 
            { $set: updates }, // Use $set to update specific fields
            { new: true }      // Return the updated document after the update is applied
        );

        if (!updatedOrder) {
            return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found.` }), { status: 404 });
        }

        // 5. Success Response
        return new Response(JSON.stringify(updatedOrder), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("API Error during order update:", error.message);
        return new Response(JSON.stringify({ error: "Server error during update." }), { status: 500 });
    }
}

/**
 * DELETE Handler: Handles order deletion.
 */
export async function DELETE(request: Request, context: { params: { orderId: string } }) {
    try {
        const orderId = context.params.orderId;
        
        if (!orderId) {
            return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
        }

        await dbConnect(); // Establish a database connection
        
        // 1. Database Operation: Use Mongoose to find the order by ID and delete it
        const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            // If deletedOrder is null, the order was not found
            return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found for deletion.` }), { status: 404 });
        }

        // 2. Success Response
        return new Response(JSON.stringify({ success: true, message: "Order deleted successfully." }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("API Error during order deletion:", error.message);
        return new Response(JSON.stringify({ error: "Server error during deletion." }), { status: 500 });
    }
}
