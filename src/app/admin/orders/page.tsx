// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Trash2, RefreshCcw } from "lucide-react";

// // --- Global Styling for Fonts (You would typically put this in a global CSS file) ---
// const GlobalStyles = () => (
//   <style jsx global>{`
//     @import url("https://fonts.googleapis.com/css2?family=Yeseve+One&family=Varela+Round&display=swap");
//     h1,
//     h2,
//     h3,
//     h4,
//     h5,
//     h6,
//     .font-yeseve {
//       font-family: "Yeseve One", serif;
//     }
//     body,
//     p,
//     span,
//     label,
//     .font-varela {
//       font-family: "Varela Round", sans-serif;
//     }
//   `}</style>
// );

// // Helper function to get status badge color
// const getStatusVariant = (status: string) => {
//   switch (status) {
//     case "paid":
//       return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
//     case "fulfilled":
//       return "bg-sky-500/20 text-sky-300 border-sky-500/40";
//     case "unpaid":
//     default:
//       return "bg-red-500/20 text-red-300 border-red-500/40";
//   }
// };

// export default function OrderPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);

//   // Function to fetch orders from the API route
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/orders");
//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error(error);
//       // Handle the error in the UI, e.g., show a toast message
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Function to handle updating an order's status
//   const handleUpdateStatus = async (orderId: string, newStatus: string) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orderStatus: newStatus }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }
//       // Re-fetch orders to get the updated data
//       fetchOrders();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Function to prepare an order for deletion and show the modal
//   const handleDeleteClick = (order: any) => {
//     setOrderToDelete(order);
//     setShowConfirmModal(true);
//   };

//   // Function to delete the order after confirmation
//   const handleDeleteOrder = async () => {
//     if (!orderToDelete) return;
//     try {
//       const response = await fetch(`/api/orders/${orderToDelete._id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to delete order");
//       }
//       // Re-fetch orders to update the list
//       fetchOrders();
//       setShowConfirmModal(false);
//       setOrderToDelete(null);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <GlobalStyles />
//       <div className="min-h-screen bg-[#141F2D] p-8 text-[#EFA765] font-[Varela Round]">
//         <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-7xl mx-auto">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-3xl font-extrabold font-[Yeseve One]">
//               Order Management
//             </CardTitle>
//             <Button
//               onClick={fetchOrders}
//               className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full"
//             >
//               <RefreshCcw className="h-4 w-4 mr-2" />
//               Refresh Orders
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center items-center h-40">
//                 <p>Loading orders...</p>
//               </div>
//             ) : (
//               <Table>
//                 <TableCaption className="text-white text-opacity-80">
//                   A list of all successful orders.
//                 </TableCaption>
//                 <TableHeader>
//                   <TableRow className="border-[#EFA765]/40 hover:bg-[#EFA765]/10">
//                     <TableHead className="w-[100px] text-[#EFA765]">
//                       Order ID
//                     </TableHead>
//                     <TableHead className="text-[#EFA765]">
//                       Customer Email
//                     </TableHead>
//                     <TableHead className="text-[#EFA765]">
//                       Total Amount
//                     </TableHead>
//                     <TableHead className="text-[#EFA765] text-center">
//                       Status
//                     </TableHead>
//                     <TableHead className="text-[#EFA765]">Items</TableHead>
//                     <TableHead className="text-[#EFA765]">Date</TableHead>
//                     <TableHead className="text-[#EFA765] text-right">
//                       Actions
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {orders.length > 0 ? (
//                     orders.map((order: any) => (
//                       <TableRow
//                         key={order._id}
//                         className="border-[#EFA765]/20 hover:bg-[#EFA765]/10"
//                       >
//                         <TableCell className="font-medium text-white text-opacity-90">
//                           {order._id.substring(0, 8)}...
//                         </TableCell>
//                         <TableCell className="text-white text-opacity-90">
//                           {order.customerEmail}
//                         </TableCell>
//                         <TableCell className="text-white text-opacity-90">
//                           {order.currency.toUpperCase()}{" "}
//                           {order.totalAmount.toFixed(2)}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Select
//                             value={order.orderStatus}
//                             onValueChange={(newStatus) =>
//                               handleUpdateStatus(order._id, newStatus)
//                             }
//                           >
//                             <SelectTrigger
//                               className={`rounded-full capitalize w-[120px] ${getStatusVariant(order.orderStatus)}`}
//                             >
//                               <SelectValue placeholder="Status" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/40">
//                               <SelectItem value="unpaid">Unpaid</SelectItem>
//                               <SelectItem value="paid">Paid</SelectItem>
//                               <SelectItem value="fulfilled">
//                                 Fulfilled
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                         <TableCell className="text-white text-opacity-90">
//                           {order.items.map((item: any, index: number) => (
//                             <span key={index}>
//                               {item.name} ({item.quantity})<br />
//                             </span>
//                           ))}
//                         </TableCell>
//                         <TableCell className="text-white text-opacity-90">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             onClick={() => handleDeleteClick(order)}
//                             variant="ghost"
//                             size="icon"
//                             className="text-red-500 hover:bg-red-500/20"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="text-center text-white/70"
//                       >
//                         No orders found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-2xl border border-[#EFA765]/20 max-w-sm w-full text-[#EFA765]">
//             <CardHeader>
//               <CardTitle className="text-2xl font-[Yeseve One]">
//                 Confirm Deletion
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="font-[Varela Round] mb-4">
//                 Are you sure you want to delete this order? This action cannot
//                 be undone.
//               </p>
//               <div className="flex justify-end space-x-2">
//                 <Button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="bg-gray-500/20 text-white hover:bg-gray-500/40"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleDeleteOrder}
//                   className="bg-red-600 text-white hover:bg-red-700"
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
// We are no longer using the Table component, so it has been removed.
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Helper function to get status badge color
const getStatusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    case "fulfilled":
      return "bg-sky-500/20 text-sky-300 border-sky-500/40";
    case "unpaid":
    default:
      return "bg-red-500/20 text-red-300 border-red-500/40";
  }
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Function to fetch orders from the API route
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      // Handle the error in the UI, e.g., show a toast message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle updating an order's status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      // Re-fetch orders to get the updated data
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to prepare an order for deletion and show the modal
  const handleDeleteClick = (order: any) => {
    setOrderToDelete(order);
    setShowConfirmModal(true);
  };

  // Function to delete the order after confirmation
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const response = await fetch(`/api/orders/${orderToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      // Re-fetch orders to update the list
      fetchOrders();
      setShowConfirmModal(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#141F2D] p-8 text-[#EFA765] font-sans">
        <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-7xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-extrabold yeseva-one text-[#EFA765]">
              Order Management
            </CardTitle>
            <Button
              onClick={fetchOrders}
              className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Orders
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="flex flex-col gap-6">
                {orders.map((order: any) => (
                  <Card
                    key={order._id}
                    className="bg-[#1D2B3F] text-white rounded-xl border border-[#EFA765]/20 hover:border-[#EFA765] transition-colors duration-300"
                  >
                    <CardHeader className="border-b border-[#EFA765]/20 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#EFA765] text-xl">
                            Order #{order._id.substring(0, 8)}...
                          </CardTitle>
                          <CardDescription className="text-white/70 text-sm mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => handleDeleteClick(order)}
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Customer:</span>
                        <span className="font-medium text-white">
                          {order.customerEmail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Amount:</span>
                        <span className="font-medium text-white">
                          {order.currency.toUpperCase()}{" "}
                          {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Status:</span>
                        <Select
                          value={order.orderStatus}
                          onValueChange={(newStatus) =>
                            handleUpdateStatus(order._id, newStatus)
                          }
                        >
                          <SelectTrigger
                            className={`rounded-full capitalize w-[120px] h-8 text-xs ${getStatusVariant(order.orderStatus)}`}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/40">
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-white/80">Items:</h4>
                        <ul className="text-sm pl-4 list-disc text-white">
                          {order.items.map((item: any, index: number) => (
                            <li key={index}>
                              {item.name} ({item.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/70 py-10">
                <p>No orders found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-2xl border border-[#EFA765]/20 max-w-sm w-full text-[#EFA765]">
            <CardHeader>
              <CardTitle className="text-2xl">Confirm Deletion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to delete this order? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-500/20 text-white hover:bg-gray-500/40"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteOrder}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default OrderPage;
