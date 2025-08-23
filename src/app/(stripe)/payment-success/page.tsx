import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import mongoose from 'mongoose';
import Order from '@/models/Order.model'; // Import our new Order model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    } as any);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Failed to connect to the database.");
  }
};

// Idempotent function to save the order
const saveOrderToDatabase = async (session: Stripe.Checkout.Session) => {
  try {
    // Check if an order with this session ID already exists
    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    if (existingOrder) {
      console.log(`Order with session ID ${session.id} already exists. Skipping save.`);
      return;
    }

    // Extract item details from the line_items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const orderItems = lineItems.data.map(item => ({
      name: item.description,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      quantity: item.quantity,
    }));

    // Create and save the new order document
    const newOrder = new Order({
      stripeSessionId: session.id,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      items: orderItems,
      orderStatus: 'paid', // Initial status is paid
    });
    
    await newOrder.save();
    console.log(`SERVER: New order saved to database with session ID: ${session.id}`);

  } catch (error) {
    console.error("Error saving order to database:", error);
    throw new Error("Failed to save order details.");
  }
};

// A component that fetches the Stripe session and displays the results.
async function PaymentDetailsFetcher({ sessionId }: { sessionId: string }) {
  await connectToDatabase(); // Connect to the database

  let mainMessage: string = 'Verifying your payment...';
  let subMessage: string = 'Please wait while we confirm your transaction.';
  let statusColorClass: string = 'text-[#EFA765]'; // Our theme color for pending
  let icon: string = '⏳';
  let displayAmount: string | null = null;
  let showRetryButton: boolean = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      mainMessage = 'Payment session not found.';
      subMessage = 'There might have been an issue. Please contact support or try again.';
      statusColorClass = 'text-red-500';
      icon = '❌';
      showRetryButton = true;
    } else {
      const amountInCents = session.amount_total;
      if (amountInCents !== null) {
        displayAmount = (amountInCents / 100).toFixed(2);
      }

      switch (session.payment_status) {
        case 'paid':
          mainMessage = 'Payment Successful! 🎉';
          subMessage = `Thank you for your purchase. We are preparing your order now.`;
          statusColorClass = 'text-green-500';
          icon = '✅';

          // --- CRITICAL: Save the order to the database ---
          await saveOrderToDatabase(session);

          console.log(`SERVER: Checkout Session ${session.id} status: ${session.payment_status}.`);
          break;
        case 'unpaid':
          mainMessage = 'Payment Pending / Unpaid';
          subMessage = `Your payment is awaiting completion. Please check your payment method or try again.`;
          statusColorClass = 'text-yellow-500';
          icon = '⏳';
          showRetryButton = true;
          console.log(`SERVER: Checkout Session ${session.id} status: ${session.payment_status}.`);
          break;
        default:
          mainMessage = 'Payment Status Unknown';
          subMessage = 'There was an issue processing your payment. Please contact support.';
          statusColorClass = 'text-gray-500';
          icon = '❓';
          showRetryButton = true;
          console.log(`SERVER: Checkout Session ${session.id} has unknown payment status: ${session.payment_status}.`);
          break;
      }
    }
  } catch (error: any) {
    console.error('SERVER: Error retrieving Stripe Checkout Session or saving order:', error);
    mainMessage = 'An error occurred during payment verification.';
    subMessage = `Error details: ${error.message}. Please contact support.`;
    statusColorClass = 'text-red-500';
    icon = '🚫';
    showRetryButton = true;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
      <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-xl max-w-md mx-auto text-center border border-[#EFA765]/20">
        <div className={`text-7xl mb-6 transform transition-transform duration-500 ease-out ${statusColorClass}`}>
          {icon}
        </div>
        <h1 className="text-4xl font-extrabold mb-3 leading-tight font-[Yeseve One]">{mainMessage}</h1>
        <p className={`text-lg mb-6 text-white text-opacity-80`}>{subMessage}</p>

        {displayAmount && statusColorClass === 'text-green-500' && (
          <div className="bg-green-900/40 p-4 rounded-xl text-green-300 text-4xl font-bold mb-8 border border-green-700 shadow-inner">
            Total Paid: PKR {displayAmount}
          </div>
        )}

        <div className="mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/">
            <Button className="w-full md:w-auto bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
              Back to Home
            </Button>
          </Link>
          {showRetryButton && (
            <Link href="/checkout">
              <Button variant="outline" className="w-full md:w-auto border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765]/10 transition-colors duration-300 rounded-full">
                Try Payment Again
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  if (typeof sessionId !== 'string') {
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765]">
          <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
            <div className="text-7xl mb-6 text-[#EFA765] animate-pulse">
              <Loader2 className="h-20 w-20 animate-spin mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-white font-[Yeseve One]">Verifying Payment...</h1>
            <p className="text-white text-opacity-80 mt-3 text-lg font-[Varela Round]">Please do not close this window.</p>
          </div>
        </div>
      }
    >
      <PaymentDetailsFetcher sessionId={sessionId} />
    </Suspense>
  );
}
