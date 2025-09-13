// // components/checkout/CheckoutPage.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { CreditCard } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { loadStripe } from '@stripe/stripe-js';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from './CartSummary';
// import ShippingAddressForm from './ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react'; // To get logged-in user's email/name

// // Re-using the getStripePromise from App.js
// let stripePromise: any = null;
// const getStripePromise = () => {
//   if (!stripePromise) {
//     const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!stripePublicKey) {
//       console.error("Stripe public key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.");
//       return null;
//     }
//     stripePromise = loadStripe(stripePublicKey);
//   }
//   return stripePromise;
// };

// interface CheckoutPageProps {
//   cart: any[];
//   handleUpdateQuantity: (product: any, quantity: number) => void;
//   handleRemoveItem: (product: any) => void;
//   getOriginalCartTotal: () => number;
//   dispatch: React.Dispatch<any>; // To clear cart after checkout
//   setCurrentPage: (page: string) => void;
// }

// const CheckoutPage: React.FC<CheckoutPageProps> = ({
//   cart,
//   handleUpdateQuantity,
//   handleRemoveItem,
//   getOriginalCartTotal,
//   dispatch,
//   setCurrentPage,
// }) => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [finalCartTotal, setFinalCartTotal] = useState<number>(getOriginalCartTotal());

//   const idempotencyKeyRef = React.useRef(uuidv4());

//   // Update finalCartTotal when original cart total or coupon changes
//   useEffect(() => {
    
//     setFinalCartTotal(currentTotal < 0 ? 0 : currentTotal);
//   }, [getOriginalCartTotal, appliedCoupon, cart]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };


//   const handleCheckout = () => {
//     if (!isShippingFormValid || !shippingAddress) {
//       toast.error("Please complete the shipping address form correctly.");
//       return;
//     }
//     if (cart.length === 0) {
//       toast.error("Your cart is empty. Please add items before checking out.");
//       return;
//     }

//     const stripePromise = getStripePromise();

//     const promise = async () => {
//       setIsLoading(true);
//       if (!stripePromise) {
//         throw new Error("Stripe failed to load.");
//       }

//       const stripe = await stripePromise;
//       if (!stripe) {
//         throw new Error("Stripe object not available.");
//       }

//       const checkoutData = {
//         cartItems: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         shippingAddress: shippingAddress,
//         appliedCoupon: appliedCoupon,
//         finalAmount: finalCartTotal,
//         originalTotal: getOriginalCartTotal(),
//         // Add customer email from session if available
//         customerEmail: session?.user?.email,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": idempotencyKeyRef.current,
//         },
//         cache: "no-cache",
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();

//       if (response.ok && data.sessionId) {
//         // Clear cart after successful redirection to Stripe
//         dispatch({ type: 'CLEAR_CART' });
//         stripe.redirectToCheckout({ sessionId: data.sessionId });
//         return "Redirecting to payment...";
//       } else {
//         throw new Error(data.message || "Failed to initiate checkout. Please try again.");
//       }
//     };

//     toast.promise(promise(), {
//       loading: "Initiating payment...",
//       success: (message) => {
//         setIsLoading(false);
//         return message;
//       },
//       error: (error) => {
//         setIsLoading(false);
//         return `An unexpected error occurred: ${error.message}`;
//       },
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//       {/* Left Column: Shipping Address Form */}
//       <div className="space-y-6">
//         <ShippingAddressForm
//           onFormChange={handleShippingFormChange}
//         />
//       </div>

//       {/* Right Column: Order Summary & Coupon */}
//       <div className="space-y-6">
//         <CartSummary
//           cart={cart}
//           handleUpdateQuantity={handleUpdateQuantity}
//           handleRemoveItem={handleRemoveItem}
//           getCartTotal={() => finalCartTotal}
//           appliedCoupon={appliedCoupon}
//           originalCartTotal={getOriginalCartTotal()}
//         />

       

//         <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765]">
//           <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2 font-[Yeseve One]">Final Amount</h3>
//           <div className="flex justify-between items-center text-xl font-bold my-4">
//             <span className="font-[Yeseve One]">Grand Total:</span>
//             <span className="font-[Yeseve One]">PKR {finalCartTotal.toFixed(2)}</span>
//           </div>
//           <Button
//             onClick={handleCheckout}
//             disabled={isLoading || cart.length === 0 || !isShippingFormValid || finalCartTotal <= 0}
//             className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full"
//           >
//             {isLoading ? (
//               <>
//                 <CreditCard className="mr-2 h-4 w-4 animate-spin" />
//                 Processing Payment...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Proceed to Payment
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={() => setCurrentPage('products')}
//             variant="outline"
//             className="w-full border-[#EFA765] bg-white/1 text-[#EFA765] hover:bg-[#EFA765]/10 hover:text-[#EFA765] hover:cursor-pointer transition-colors duration-300 rounded-full mt-4"
//           >
//             Continue Shopping
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;



"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';
import CartSummary from './CartSummary';
import ShippingAddressForm from './ShippingAddressForm';
import { Card } from '@/components/ui/card';
import { IShippingAddress } from '@/models/Order.model';
import { useSession } from 'next-auth/react';

// Re-using the getStripePromise from App.js
let stripePromise: any = null;
const getStripePromise = () => {
  if (!stripePromise) {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripePublicKey) {
      console.error("Stripe public key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.");
      return null;
    }
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

interface CheckoutPageProps {
  cart: any[];
  handleUpdateQuantity: (product: any, quantity: number) => void;
  handleRemoveItem: (product: any) => void;
  getOriginalCartTotal: () => number;
  dispatch: React.Dispatch<any>;
  setCurrentPage: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  handleUpdateQuantity,
  handleRemoveItem,
  getOriginalCartTotal,
  dispatch,
  setCurrentPage,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
  const [isShippingFormValid, setIsShippingFormValid] = useState(false);
  const [finalCartTotal, setFinalCartTotal] = useState<number>(0);

  const idempotencyKeyRef = React.useRef(uuidv4());

  // Update finalCartTotal when original cart total changes
  useEffect(() => {
    setFinalCartTotal(getOriginalCartTotal());
  }, [getOriginalCartTotal, cart]);

  const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
    setShippingAddress(data);
    setIsShippingFormValid(isValid);
  };

  const handleCheckout = () => {
    if (!isShippingFormValid || !shippingAddress) {
      toast.error("Please complete the shipping address form correctly.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    const stripePromise = getStripePromise();

    const promise = async () => {
      setIsLoading(true);
      if (!stripePromise) {
        throw new Error("Stripe failed to load.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe object not available.");
      }

      const checkoutData = {
        cartItems: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: shippingAddress,
        finalAmount: finalCartTotal,
        originalTotal: getOriginalCartTotal(),
        customerEmail: session?.user?.email,
      };

      const response = await fetch("/api/stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKeyRef.current,
        },
        cache: "no-cache",
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.sessionId) {
        dispatch({ type: 'CLEAR_CART' });
        stripe.redirectToCheckout({ sessionId: data.sessionId });
        return "Redirecting to payment...";
      } else {
        throw new Error(data.message || "Failed to initiate checkout. Please try again.");
      }
    };

    toast.promise(promise(), {
      loading: "Initiating payment...",
      success: (message) => {
        setIsLoading(false);
        return message;
      },
      error: (error) => {
        setIsLoading(false);
        return `An unexpected error occurred: ${error.message}`;
      },
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ShippingAddressForm
          onFormChange={handleShippingFormChange}
        />
      </div>

      <div className="space-y-6">
        <CartSummary
          cart={cart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleRemoveItem={handleRemoveItem}
          getCartTotal={getOriginalCartTotal}
          originalCartTotal={getOriginalCartTotal()}
        />

        <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765]">
          <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2 font-[Yeseve One]">Final Amount</h3>
          <div className="flex justify-between items-center text-xl font-bold my-4">
            <span className="font-[Yeseve One]">Grand Total:</span>
            <span className="font-[Yeseve One]">PKR {finalCartTotal.toFixed(2)}</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={isLoading || cart.length === 0 || !isShippingFormValid || finalCartTotal <= 0}
            className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full"
          >
            {isLoading ? (
              <>
                <CreditCard className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>
          <Button
            onClick={() => setCurrentPage('products')}
            variant="outline"
            className="w-full border-[#EFA765] bg-white/1 text-[#EFA765] hover:bg-[#EFA765]/10 hover:text-[#EFA765] hover:cursor-pointer transition-colors duration-300 rounded-full mt-4"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
