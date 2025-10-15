// export const UserBookings = ({ bookings }) => {
//   return (
//     <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
//       <h3 className="text-2xl font-semibold text-white mb-4">Upcoming Bookings</h3>
//       {bookings.length === 0 ? (
//         <p className="text-gray-400">No upcoming bookings found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {bookings.map((booking) => (
//             <li key={booking._id} className="border-b border-slate-700 pb-4 last:border-b-0">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-semibold text-white">Booking for: {booking.name}</p>
//                   <p className="font-semibold text-white">Booking Guests: {booking.guests}</p>
//                   <p className="font-semibold text-white">Booking Time: {booking.time}</p>
//                   <p className="text-gray-400 text-sm">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
//                 </div>
//                 <span className={`px-3 py-2 rounded-full text-xs font-semibold ${booking.isConfirmed === 'true' ? 'bg-green-500 text-[#141F2D]' : 'bg-yellow-500 text-[#141F2D]'}`}>
//                   {booking.isConfirmed === true ? 'Confirmed' : 'Pending'}
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

"use client";
import React from "react";

export const UserBookings = ({ bookings }: any) => {
  return (
    // Ensure width is set to full for better dashboard layout integration
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h3 className="font-semibold text-white mb-4 third-heading">
        Upcoming Bookings
      </h3>
      <hr className="border-slate-700 my-8" />
      {bookings.length === 0 ? (
        <p className="text-gray-400">No upcoming bookings found.</p>
      ) : (
        // --- Added Fixed Height (max-h-[400px]) and Vertical Scrolling (overflow-y-auto) ---
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <ul className="space-y-4">
            {bookings.map((booking: any) => (
              <li
                key={booking._id}
                className="border-b border-slate-700 pb-4 last:border-b-0 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    
                    <p className="font-semibold text-white">
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
                  <span
                    className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${booking.isConfirmed === "confirmed" ? "bg-green-700/20 text-green-300 border-green-700/40 border" : `${booking.isConfirmed === "pending" ? "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border" : `${booking.isConfirmed === "canceled" ? "bg-red-700/20 text-red-300 border-red-700/40 border" : "bg-gray-700/20 text-gray-300 border-gray-700/40 border"}`}`}`}
                  >
                    {booking.isConfirmed === "confirmed" ? "Confirmed" : `${booking.isConfirmed === "pending" ? "Pending" : `${booking.isConfirmed === "canceled" ? "Canceled" : "Unknown"}`}`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
