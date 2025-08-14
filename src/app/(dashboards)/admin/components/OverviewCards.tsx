import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, DollarSign, ShoppingCart, Star } from "lucide-react";
import React from "react";

const OverviewCards = ({data}) => {
  console.log('card file')
  console.log("data from cards",data)
  return (
    <>
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
        {/* Card: Total Reviews */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Reviews
            </CardTitle>
            <Star className="h-5 w-5 text-[#efa765]" />
            
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#efa765]">
              {/* {dashboardData.totalReviews.toLocaleString()} */}
              100
            </div>
          </CardContent>
        </Card>

        {/* Card: Average Rating */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Average Rating
            </CardTitle>
            <Star className="h-5 w-5 text-[#efa765]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#efa765]">
              {/* {dashboardData.averageRating.toFixed(1)} / 5 */}
              4.5
            </div>
          </CardContent>
        </Card>

        {/* Card: Total Orders */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-[#efa765]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#efa765]">
              {/* {dashboardData.totalOrders.toLocaleString()} */}
              50
            </div>
          </CardContent>
        </Card>

        {/* Card: Total Revenue */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-[#efa765]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#efa765]">
              $
              {/* {dashboardData.totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} */}
              2000
            </div>
          </CardContent>
        </Card>

        {/* Card: Total Table Bookings */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Table Bookings
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-[#efa765]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#efa765]">
              {/* {dashboardData.totalTableBookings} */}
              10
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewCards;
