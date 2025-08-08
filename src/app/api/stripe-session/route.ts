// /api/stripe-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';

const key = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(key, {
  apiVersion: "2022-11-15",
});

// Define the shape of a cart item for better type safety
type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export async function POST(request: NextRequest) {
  // Extract the idempotency key from the request headers, or generate a new one
  // This prevents accidental duplicate charges.
  const idempotencyKey = request.headers.get("X-Idempotency-Key") || uuidv4();
  const cartItems: CartItem[] = await request.json();

  try {
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "No cart data provided.", success: false }, { status: 400 });
    }

    const line_items = cartItems.map((item: CartItem) => {
      // Stripe's price is in cents, so we multiply by 100
      const unit_amount = Math.round(item.price * 100);
      
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
          },
          unit_amount: unit_amount,
        },
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID1! },
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID2! },
      ],
      line_items,
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${request.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/payment-cancel`,
    }, {
      idempotencyKey: idempotencyKey,
    });

    return NextResponse.json({ sessionId: session.id, success: true });
  } catch (err: any) {
    console.error("Stripe Checkout Session creation failed:", err); 
    return NextResponse.json({
      message: err.message || "An unexpected error occurred during checkout session creation.",
      success: false,
    }, { status: 500 });
  }
}
