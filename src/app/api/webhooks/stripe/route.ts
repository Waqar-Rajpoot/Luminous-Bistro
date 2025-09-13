import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order.model';
import Product from '@/models/Product.model'; // Assuming you have a Product model to get original prices

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature || "",
      stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ message: 'Webhook signature verification failed.' }, { status: 400 });
  }

  await dbConnect();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    
    // Check if the orderId exists in metadata
    if (!orderId) {
      console.error("Order ID not found in session metadata.");
      return NextResponse.json({ message: "Order ID not found." }, { status: 400 });
    }

    try {
      // Find the pending order in the database
      const order = await Order.findOne({ orderId, orderStatus: 'pending' });

      if (!order) {
        console.error(`Order with ID ${orderId} not found or already processed.`);
        return NextResponse.json({ message: "Order not found or already processed." }, { status: 404 });
      }

      // Retrieve the session with line items to get the final prices
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
      );
      
      const lineItems = sessionWithLineItems.line_items?.data;
      if (!lineItems || lineItems.length === 0) {
        console.error("No line items found in the session.");
        return NextResponse.json({ message: "No line items found." }, { status: 400 });
      }

      // Assuming the single line item represents the total order
      const finalPaidAmount = session.amount_total;
      
      // Update order status and final prices in your database
      order.orderStatus = 'paid';
      
      if (finalPaidAmount !== null) {
        order.finalAmount = finalPaidAmount / 100;
        // Calculate the proportional discount for each item
        const originalTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountPercentage = (originalTotal - order.finalAmount) / originalTotal;
        
        order.items.forEach(item => {
          const itemOriginalTotal = item.price * item.quantity;
          const itemFinalTotal = itemOriginalTotal * (1 - discountPercentage);
          item.finalPrice = parseFloat((itemFinalTotal / item.quantity).toFixed(2));
        });
      }
      
      await order.save();
      console.log(`Order ${orderId} successfully updated to 'paid'.`);

      return NextResponse.json({ received: true });

    } catch (err: any) {
      console.error("Error processing checkout.session.completed event:", err);
      return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Unhandled event type: ${event.type}` }, { status: 200 });
}
