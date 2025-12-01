// import { notFound } from 'next/navigation';
// import dbConnect from '@/lib/dbConnect';
// import Order, { IOrder as BaseIOrder } from '@/models/Order.model';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
// import Image from 'next/image';
// import { ShoppingBag, MapPin, Receipt, Mail } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { format } from 'date-fns'; 

// interface IOrder extends Omit<BaseIOrder, 'userId'> {
//   userId: string; 
//   _id: string; 
// }

// interface OrderDetailsPageProps {
//   params: { orderId: string };
//   searchParams: { [key: string]: string | string[] | undefined | any };
// }

// // Helper to get status color for badge
// const getOrderStatusVariant = (status: IOrder['orderStatus']) => {
//   switch (status) {
//     case 'paid': return 'outline';
//     case 'pending': return 'outline';
//     case 'canceled': return 'destructive';
//     default: return 'outline';
//   }
// };

// async function fetchOrderDetails(orderId: string): Promise<IOrder | null> {
//   await dbConnect();
//   try {
//     const order: any = await Order.findOne({ orderId }).lean();

//     if (order) {
//       const serializedOrder = {
//         ...order,
//         _id: order._id.toString(),
//         userId: order.userId.toString(),
//         createdAt: order.createdAt.toISOString(),
//         updatedAt: order.updatedAt.toISOString(),
//         items: order.items.map(item => ({
//           ...item,
//           ...(item._id && { _id: item._id.toString() }),
//         })),
//         ...(order.appliedCoupon && order.appliedCoupon._id && {
//           appliedCoupon: {
//             ...order.appliedCoupon,
//             _id: order.appliedCoupon._id.toString()
//           }
//         })
//       };
//       return serializedOrder as IOrder;
//     }
//     return null;
//   } catch (error) {
//     console.error("Failed to fetch order details:", error);
//     return null;
//   }
// }

// export default async function OrderDetailsPage({ params, searchParams }: OrderDetailsPageProps) {
//   const { orderId } = params;
//   const statusParam = searchParams.status;
//   const order = await fetchOrderDetails(orderId);

//   if (!order) {
//     notFound(); 
//   }

//   return (
//     <div className="min-h-screen bg-[#141F2D] p-8 text-[#EFA765] font-[Varela Round]">
//       <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-4xl mx-auto">
//         <CardHeader className="text-center">
//           <CardTitle className="text-4xl third-heading font-extrabold flex items-center justify-center">
//             <ShoppingBag className="mr-4 h-10 w-10 text-[#EFA765]" />
//             Order Details
//           </CardTitle>
//           <p className="text-sm text text-opacity-70 mt-2">#{order.orderId}</p>
//           {statusParam === 'error' && (
//             <p className="text-red-500 mt-4 text-lg">
//               There was an issue processing your payment. Please contact support with your order ID.
//             </p>
//           )}
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <Separator className="bg-[#EFA765]/30 my-4" />

//           {/* Order Summary */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//             <div>
//               <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><Receipt className="mr-2 h-6 w-6" /> Summary</h3>
//               <p className='text-white/60'><strong>Order ID:</strong> {order.orderId}</p>
//               {order.stripeSessionId && <p className='text-white/60 break-all'><strong>Transaction ID:</strong> {order.stripeSessionId}</p>}
//               <p className='text-white/60'><strong>Payment Status:</strong> <Badge variant={getOrderStatusVariant(order.orderStatus)} className="capitalize text-white">{order.orderStatus}</Badge></p>
//               <p className='text-white/60'><strong>Date:</strong> {format(new Date(order.createdAt), 'PPP p')}</p>
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><Mail className="mr-2 h-6 w-6" /> Customer Info</h3>
//               <p className='text-white/60'><strong>Name:</strong> {order.customerName || 'N/A'}</p>
//               <p className='text-white/60'><strong>Email:</strong> {order.customerEmail}</p>
//               <p className='text-white/60'><strong>Phone:</strong> {order.shippingAddress.phoneNumber}</p>
//               {/* <p><strong>User ID:</strong> {order.userId}</p> */}
//             </div>
//           </div>

//           <Separator className="bg-[#EFA765]/30 my-4" />

//           {/* Shipping Details */}
//           <div>
//             <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><MapPin className="mr-2 h-6 w-6" /> Shipping Details</h3>
//             <p className='text-white/60'><strong>Recipient:</strong> {order.shippingAddress.fullName}</p>
//             <p className='text-white/60'><strong>Address:</strong> {order.shippingAddress.addressLine1}</p>
//             {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
//             <p className='text-white/60'><strong>Shipping status:</strong> <span className="capitalize border text-white rounded-xl px-2 py-0.2">{order.shippingProgress}</span></p>
//             <p className='text-white/60'>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
//             <p className='text-white/60'>{order.shippingAddress.country}</p>
//           </div>
//           <Separator className="bg-[#EFA765]/30 my-4" />

//           {/* Order Items */}
//           <div>
//             <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-4 flex items-center"><ShoppingBag className="mr-2 h-6 w-6" /> Items</h3>
//             <div className="space-y-4">
//               {order.items.map((item) => (
//                 <div key={item.id} className="flex items-center space-x-4 p-3 border border-[#EFA765]/10 rounded-lg bg-[#2a3b52]">
//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     width={80}
//                     height={80}
//                     className="w-20 h-20 object-cover rounded-md"
//                   />
//                   <div>
//                     <h4 className="text-lg font-bold text-[#EFA765]">{item.name}</h4>
//                     <p className="text-white/60 text-opacity-80">Quantity: {item.quantity}</p>
//                     <p className="text-white/60 text-opacity-80">Unit Price: PKR {item.price.toFixed(2)}</p>
//                     <p className="text-lg text-white/60 font-semibold">Total: PKR {(item.price * item.quantity).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Separator className="bg-[#EFA765]/30 my-4" />

//           {/* Totals */}
//           <div className="text-right space-y-2 tracking-wider text-[#EFA765] yeseva-one">
//             <p className="text-lg"><strong>Subtotal:</strong> PKR {order.totalAmount.toFixed(2)}</p>
//             {/* Display discount amount only if it's greater than 0 */}
//             {order.discountAmount > 0 && <p className="text-lg text-green-400"><strong>Discount:</strong> - PKR {order.discountAmount.toFixed(2)}</p>}
//             <p className="text-2xl font-bold font-[Yeseve One] border-t border-[#EFA765]/30 pt-4 mt-4">
//               Grand Total: PKR {order.finalAmount.toFixed(2)}
//             </p>
//           </div>

//           <div className="mt-8 text-center">
//             <Link href="/">
//               <Button className="w-full md:w-auto bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
//                 Back to Home
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Order, { IOrder as BaseIOrder } from '@/models/Order.model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingBag, MapPin, Receipt, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns'; 

interface IOrder extends Omit<BaseIOrder, 'userId'> {
  userId: string; 
  _id: string; 
}

interface OrderDetailsPageProps {
  params: { orderId: string };
  searchParams: { [key: string]: string | string[] | undefined | any };
}

// Helper to get status color for badge
const getOrderStatusVariant = (status: IOrder['orderStatus']) => {
  switch (status) {
    case 'paid': return 'outline';
    case 'pending': return 'outline';
    case 'canceled': return 'destructive';
    default: return 'outline';
  }
};

async function fetchOrderDetails(orderId: string): Promise<IOrder | null> {
  await dbConnect();
  try {
    const order: any = await Order.findOne({ orderId }).lean();

    if (order) {
      // Serialize Mongoose object for Next.js component props
      const serializedOrder = {
        ...order,
        _id: order._id.toString(),
        userId: order.userId.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map(item => ({
          ...item,
          ...(item._id && { _id: item._id.toString() }),
        })),
        // Coupon code functionality and serialization logic has been fully removed.
      };
      return serializedOrder as IOrder;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

export default async function OrderDetailsPage({ params, searchParams }: OrderDetailsPageProps) {
  const { orderId } = params; // Fix for the previous build error
  const statusParam = searchParams.status;
  const order = await fetchOrderDetails(orderId);

  if (!order) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-[#141F2D] p-8 text-[#EFA765] font-[Varela Round]">
      <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl third-heading font-extrabold flex items-center justify-center">
            <ShoppingBag className="mr-4 h-10 w-10 text-[#EFA765]" />
            Order Details
          </CardTitle>
          <p className="text-sm text text-opacity-70 mt-2">#{order.orderId}</p>
          {statusParam === 'error' && (
            <p className="text-red-500 mt-4 text-lg">
              There was an issue processing your payment. Please contact support with your order ID.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator className="bg-[#EFA765]/30 my-4" />

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><Receipt className="mr-2 h-6 w-6" /> Summary</h3>
              <p className='text-white/60'><strong>Order ID:</strong> {order.orderId}</p>
              {order.stripeSessionId && <p className='text-white/60 break-all'><strong>Transaction ID:</strong> {order.stripeSessionId}</p>}
              <p className='text-white/60'><strong>Payment Status:</strong> <Badge variant={getOrderStatusVariant(order.orderStatus)} className="capitalize text-white">{order.orderStatus}</Badge></p>
              <p className='text-white/60'><strong>Date:</strong> {format(new Date(order.createdAt), 'PPP p')}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><Mail className="mr-2 h-6 w-6" /> Customer Info</h3>
              <p className='text-white/60'><strong>Name:</strong> {order.customerName || 'N/A'}</p>
              <p className='text-white/60'><strong>Email:</strong> {order.customerEmail}</p>
              <p className='text-white/60'><strong>Phone:</strong> {order.shippingAddress.phoneNumber}</p>
              {/* <p><strong>User ID:</strong> {order.userId}</p> */}
            </div>
          </div>

          <Separator className="bg-[#EFA765]/30 my-4" />

          {/* Shipping Details */}
          <div>
            <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-2 flex items-center"><MapPin className="mr-2 h-6 w-6" /> Shipping Details</h3>
            <p className='text-white/60'><strong>Recipient:</strong> {order.shippingAddress.fullName}</p>
            <p className='text-white/60'><strong>Address:</strong> {order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p className='text-white/60'><strong>Shipping status:</strong> <span className="capitalize border text-white rounded-xl px-2 py-0.2">{order.shippingProgress}</span></p>
            <p className='text-white/60'>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p className='text-white/60'>{order.shippingAddress.country}</p>
          </div>
          <Separator className="bg-[#EFA765]/30 my-4" />

          {/* Order Items */}
          <div>
            <h3 className="text-2xl font-bold text-[#EFA765] yeseva-one mb-4 flex items-center"><ShoppingBag className="mr-2 h-6 w-6" /> Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border border-[#EFA765]/10 rounded-lg bg-[#2a3b52]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-[#EFA765]">{item.name}</h4>
                    <p className="text-white/60 text-opacity-80">Quantity: {item.quantity}</p>
                    <p className="text-white/60 text-opacity-80">Unit Price: PKR {item.price.toFixed(2)}</p>
                    <p className="text-lg text-white/60 font-semibold">Total: PKR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-[#EFA765]/30 my-4" />

          {/* Totals */}
          {/* Discount/Coupon lines have been removed, leaving only the final total amount. */}
          <div className="text-right space-y-2 tracking-wider text-[#EFA765] yeseva-one">
            <p className="text-2xl font-bold border-t border-[#EFA765]/30 pt-4 mt-4">
              Total Amount: PKR {order.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button className="w-full md:w-auto bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
