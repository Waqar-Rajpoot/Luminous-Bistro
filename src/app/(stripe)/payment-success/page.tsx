// // app/payment-success/page.tsx
// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import Stripe from 'stripe';
// import { Loader2 } from 'lucide-react';
// import dbConnect from '@/lib/dbConnect'; // Use your central dbConnect
// import Order from '@/models/Order.model'; // Import your Order model

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2022-11-15', // Ensure this matches your API version
// });

// // A server component that fetches the Stripe session and updates the order status.
// async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
//   await dbConnect(); // Connect to the database using your centralized utility

//   try {
//     const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

//     if (!stripeSession || stripeSession.payment_status !== 'paid') {
//       console.warn(`SERVER: Payment for session ${sessionId} was not successful or session not found.`);
//       // If payment not successful or session missing, update order to canceled/failed
//       // It's important to find by our internal orderId first
//       await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//       // Redirect to a specific cancel page or back to home with an error message
//       redirect(`/payment-cancel`); 
//       // Note: redirect() throws an error internally, so the code below it won't execute
//     }

//     // --- CRITICAL: Find the pending order and update its status ---
//     const order = await Order.findOne({ orderId: orderId });

//     if (!order) {
//       console.error(`SERVER: Order ${orderId} not found in DB after successful Stripe payment.`);
//       // If order is not found, it's a critical error. Redirect to a generic error page
//       // or to order details with an error query param.
//       redirect(`/order-details/${orderId}?status=error`);
//       // Note: redirect() throws an error internally
//     }

//     if (order.orderStatus === 'pending') {
//       order.orderStatus = 'paid';
//       order.stripeSessionId = sessionId; // Associate Stripe session ID
//       await order.save();
//       console.log(`SERVER: Order ${orderId} status updated to PAID with Stripe session ${sessionId}.`);
//     } else {
//       console.log(`SERVER: Order ${orderId} was already processed (status: ${order.orderStatus}). Skipping update.`);
//     }

//     // --- Redirect to the dedicated Order Details page ---
//     redirect(`/order-details/${orderId}`);
//     // Note: redirect() throws an error internally
//   } catch (error: any) {
//     // MODIFICATION: Check if the error is the internal NEXT_REDIRECT error
//     if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
//       throw error; // Re-throw the NEXT_REDIRECT error so Next.js can handle it
//     }
//     // For actual errors (Stripe API, DB, etc.)
//     console.error('SERVER: Actual error retrieving Stripe Checkout Session or processing order:', error);
//     // Attempt to update order status to failed/canceled if an error occurs
//     await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//     redirect(`/payment-cancel`); // Redirect to cancel page on severe error
//   }
//   return null; // This will only be reached if no redirects happened or an error was thrown and caught.
// }

// export default async function PaymentSuccessPage({
//   searchParams,
// }: {
//   searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
// }) {
//   const resolvedSearchParams = await searchParams;
//   const sessionId = resolvedSearchParams.session_id;
//   const orderId = resolvedSearchParams.order_id; // Retrieve the internal orderId from the URL

//   if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
//     // If essential parameters are missing, redirect to home or an error page
//     redirect('/');
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765]">
//           <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
//             <div className="text-7xl mb-6 text-[#EFA765] animate-pulse">
//               <Loader2 className="h-20 w-20 animate-spin mx-auto" />
//             </div>
//             <h1 className="text-4xl font-extrabold text-white font-[Yeseve One]">Verifying Payment...</h1>
//             <p className="text-white text-opacity-80 mt-3 text-lg font-[Varela Round]">Please do not close this window.</p>
//           </div>
//         </div>
//       }
//     >
//       {/* The PaymentDetailsProcessor handles the payment verification and redirection */}
//       <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
//     </Suspense>
//   );
// }




import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { Loader2, CheckCircle } from 'lucide-react';
import dbConnect from '@/lib/dbConnect'; // Use your central dbConnect
import Order from '@/models/Order.model'; // Import your Order model
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15', // Ensure this matches your API version
});

// A server component that fetches the Stripe session and updates the order status.
async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
  await dbConnect(); // Connect to the database using your centralized utility

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!stripeSession || stripeSession.payment_status !== 'paid') {
      console.warn(`SERVER: Payment for session ${sessionId} was not successful or session not found.`);
      // If payment not successful or session missing, update order to canceled/failed
      // It's important to find by our internal orderId first
      await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
      // Redirect to a specific cancel page or back to home with an error message
      redirect(`/payment-cancel`);
      // Note: redirect() throws an error internally, so the code below it won't execute
    }

    // --- CRITICAL: Find the pending order and update its status ---
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      console.error(`SERVER: Order ${orderId} not found in DB after successful Stripe payment.`);
      // If order is not found, it's a critical error. Redirect to a generic error page
      // or to order details with an error query param.
      redirect(`/order-details/${orderId}?status=error`);
      // Note: redirect() throws an error internally
    }

    if (order.orderStatus === 'pending') {
      order.orderStatus = 'paid';
      order.stripeSessionId = sessionId; // Associate Stripe session ID
      await order.save();
      console.log(`SERVER: Order ${orderId} status updated to PAID with Stripe session ${sessionId}.`);
    } else {
      console.log(`SERVER: Order ${orderId} was already processed (status: ${order.orderStatus}). Skipping update.`);
    }

    // --- Return a success message and link instead of redirecting ---
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
        <Card className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
            </div>
            <CardTitle className="text-4xl font-extrabold text-[#EFA765] font-[Yeseve One]">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-opacity-80 mt-3 text-lg">Thank you for your purchase. Your order has been placed.</p>
            <p className="text-white text-opacity-80 mt-1 text-md">Order ID: #{orderId}</p>
            <Link href={`/order-details/${orderId}`} passHref>
              <Button className="mt-8 w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
                View Order Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );

  } catch (error: any) {
    // MODIFICATION: Check if the error is the internal NEXT_REDIRECT error
    if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw the NEXT_REDIRECT error so Next.js can handle it
    }
    // For actual errors (Stripe API, DB, etc.)
    console.error('SERVER: Actual error retrieving Stripe Checkout Session or processing order:', error);
    // Attempt to update order status to failed/canceled if an error occurs
    await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
    redirect(`/payment-cancel`); // Redirect to cancel page on severe error
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;
  const orderId = resolvedSearchParams.order_id; // Retrieve the internal orderId from the URL

  if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
    // If essential parameters are missing, redirect to home or an error page
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
          <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
            <div className="text-7xl mb-6 text-[#EFA765] animate-pulse">
              <Loader2 className="h-20 w-20 animate-spin mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-white font-[Yeseve One]">Verifying Payment...</h1>
            <p className="text-white text-opacity-80 mt-3 text-lg">Please do not close this window.</p>
          </div>
        </div>
      }
    >
      {/* The PaymentDetailsProcessor handles the payment verification and returns the final content */}
      <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
    </Suspense>
  );
}
