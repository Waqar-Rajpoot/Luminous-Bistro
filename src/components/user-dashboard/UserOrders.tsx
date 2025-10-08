"use client";
import React from "react";

export const UserOrders = ({ orders }: any) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl text-white">
      <h3 className="text-2xl font-semibold mb-4 third-heading">
        Recent Orders
      </h3>
      <hr className="border-slate-700 my-8" />
      {orders.length === 0 ? (
        <p className="text-gray-400">No recent orders found.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border-b border-slate-700 pb-4 last:border-b-0"
              >
                <a
                  href={`/order-details/${order.orderId}`}
                  className="cursor-pointer transition-colors duration-200 hover:bg-slate-700 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center no-underline text-white"
                >
                  <div className="flex-grow">
                    <p className="font-semibold">
                      Order ID: {order._id.substring(0, 10)}...
                    </p>
                    <p className="text-md text-gray-300">
                      Customer: {order.customerName}
                    </p>
                    <p>Shipping Status:
                    <span
                      className={`mt-2 sm:mt-0 ml-2 px-2 rounded-full text-xs font-semibold uppercase ${order.shippingProgress === "processing" ? "bg-yellow-500 text-slate-800" : order.shippingProgress === "shipped" ? "bg-blue-500 text-slate-800" : order.shippingProgress === "delivered" ? "bg-green-500 text-slate-800" : order.shippingProgress === "canceled" ? "bg-red-500 text-white" : "bg-gray-500 text-white"}`}
                    >
                      {order.shippingProgress}
                    </span>
                    </p>
                    <p className="text-lg font-bold text-[#EFA765]">
                      Paid Amount: {order.finalAmount} PKR
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold uppercase ${order.orderStatus === "paid" ? "bg-green-500 text-slate-800" : "bg-yellow-500 text-white"}`}
                  >
                    {order.orderStatus}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
