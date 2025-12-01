// "use client";
// import React from "react";

// export const UserBookings = ({ recentBookings }: any) => {
//   return (
//     // Ensure width is set to full for better dashboard layout integration
//     <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
//       <h3 className="font-semibold text-white mb-4 third-heading">
//         Upcoming Bookings
//       </h3>
//       <hr className="border-slate-700 my-8" />
//       {recentBookings.length === 0 ? (
//         <p className="text-gray-400">No upcoming bookings found.</p>
//       ) : (
//         <div className="max-h-[400px] overflow-y-auto pr-2">
//           <ul className="space-y-4">
//             {recentBookings.map((booking: any) => (
//               <li
//                 key={booking._id}
//                 className="border-b border-slate-700 pb-4 last:border-b-0 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
                    
//                     <p className="font-semibold text-white">
//                       Booking for: {booking.name}
//                     </p>
//                     <p className="text-sm text-gray-300">
//                       Guests: {booking.guests}
//                     </p>
//                     <p className="text-sm text-gray-300">
//                       Time: {booking.time}
//                     </p>
//                     <p className="text-gray-400 text-xs mt-1">
//                       Date: {new Date(booking.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span
//                     className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${booking.isConfirmed === "confirmed" ? "bg-green-700/20 text-green-300 border-green-700/40 border" : `${booking.isConfirmed === "pending" ? "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border" : `${booking.isConfirmed === "canceled" ? "bg-red-700/20 text-red-300 border-red-700/40 border" : "bg-gray-700/20 text-gray-300 border-gray-700/40 border"}`}`}`}
//                   >
//                     {booking.isConfirmed === "confirmed" ? "Confirmed" : `${booking.isConfirmed === "pending" ? "Pending" : `${booking.isConfirmed === "canceled" ? "Canceled" : "Unknown"}`}`}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserBookings;





"use client";
import React, { useState } from "react";
import { XCircle, Loader2 } from 'lucide-react';

interface Booking {
  _id: string;
  name: string;
  guests: number;
  time: string;
  date: string;
  isConfirmed: 'pending' | 'confirmed' | 'canceled' | string;
}

export const UserBookings = ({ recentBookings }: { recentBookings: Booking[] | any }) => {
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    if (loadingBookingId) return;
    
    console.log(`Attempting to cancel booking: ${bookingId}`);
    setLoadingBookingId(bookingId);

    try {
  
      await fetch(`/api/bookingTable/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isConfirmed: 'canceled' }),
        headers: { 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error(`Error canceling booking ${bookingId}:`, error);
    } finally {
      setLoadingBookingId(null);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full text-white">
      <h3 className="text-xl font-semibold mb-4 third-heading">
        Upcoming Bookings
      </h3>
      <hr className="border-slate-700 my-4" />
      {recentBookings.length === 0 ? (
        <p className="text-gray-400">No upcoming bookings found.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <ul className="space-y-4 mx-1 py-4">
            {recentBookings.map((booking: Booking) => {
              const isPending = booking.isConfirmed === "pending";
              const isLoading = loadingBookingId === booking._id;

              const statusColor = booking.isConfirmed === "confirmed" 
                ? "bg-green-700/20 text-green-300 border-green-700/40" 
                : booking.isConfirmed === "pending" 
                ? "bg-yellow-700/20 text-yellow-300 border-yellow-700/40" 
                : booking.isConfirmed === "canceled" 
                ? "bg-red-700/20 text-red-300 border-red-700/40" 
                : "bg-gray-700/20 text-gray-300 border-gray-700/40";

              return (
                <li
                  key={booking._id}
                  className="border-b border-slate-700 pb-4 last:border-b-0 p-3 -m-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start sm:items-center w-full min-w-0">
                    
                    {/* Left: Booking Details */}
                    <div className="flex-grow min-w-0 pr-4">
                      <p className="font-semibold text-white truncate">
                        Booking for: {booking.name}
                      </p>
                      <p className="text-sm text-gray-300">
                        Guests: {booking.guests}
                      </p>
                      <p className="text-sm text-gray-300">
                        Time: {booking.time}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Date: {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Right: Status and Action Button */}
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0 flex-shrink-0">
                      
                      {/* Status Tag */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${statusColor}`}
                      >
                        {booking.isConfirmed === "confirmed" ? "Confirmed" : booking.isConfirmed === "pending" ? "Pending" : booking.isConfirmed === "canceled" ? "Canceled" : "Unknown"}
                      </span>
                      
                      {/* Cancel Button (Visible only if status is Pending) */}
                      {isPending && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={isLoading}
                          className={`
                            flex items-center justify-center py-1 px-3 text-sm font-medium rounded-full transition-all duration-300 transform-gpu
                            ${isLoading 
                              ? 'bg-red-900/40 text-red-400 cursor-not-allowed animate-pulse' 
                              : 'bg-red-700/20 text-red-300 border-red-700/40 border hover:bg-red-700/40 hover:cursor-pointer active:scale-95'
                            }
                          `}
                          aria-label={`Cancel booking for ${booking.name}`}
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <XCircle className="h-5 w-5 mr-1" />
                          )}
                          <span className="hidden sm:inline">
                            {isLoading ? 'Cancelling...' : 'Cancel'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
