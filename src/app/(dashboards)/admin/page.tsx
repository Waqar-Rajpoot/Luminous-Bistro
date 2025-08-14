"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import axios from "axios";

import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have Shadcn Card components
import {
  Utensils,
  Box, // For Reviews
  MessageSquare, // For Contact Messages
  CalendarCheck, // For Booked Tables
  ListOrdered, // For Order Management
} from "lucide-react"; // Import new icons
import OverviewCards from "./components/OverviewCards";
import ReviewsChart from "./components/ReviewsChart";

// Data types for the dashboard summary
interface DashboardData {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
  totalContactMessages: number;
  totalVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  totalTableBookings: number;
}

// Data types for the monthly charts
interface MonthlyData {
  name: string; // E.g., "Jan", "Feb"
  reviews: number;
  orders: number;
  bookings: number;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchSummaryData = () => {
    return new Promise<DashboardData>((resolve) => {
      setTimeout(() => {
        // Mock data based on your website's potential data.
        const mockData: DashboardData = {
          totalReviews: 250,
          averageRating: 4.6,
          ratingBreakdown: {
            "5": 180, // 72%
            "4": 50, // 20%
            "3": 10, // 4%
            "2": 5, // 2%
            "1": 5, // 2%
          },
          totalContactMessages: 15,
          totalVisitors: 15430,
          totalOrders: 540,
          totalRevenue: 28500.5,
          totalTableBookings: 85,
        };
        resolve(mockData);
      }, 1500);
    });
  };

  const fetchMonthlyData = () => {
    return new Promise<MonthlyData[]>((resolve) => {
      setTimeout(() => {
        // Mock monthly data for reviews, orders, and bookings.
        const mockMonthlyData: MonthlyData[] = [
          { name: "Jan", reviews: 20, orders: 45, bookings: 10 },
          { name: "Feb", reviews: 35, orders: 70, bookings: 15 },
          { name: "Mar", reviews: 40, orders: 85, bookings: 20 },
          { name: "Apr", reviews: 28, orders: 60, bookings: 12 },
          { name: "May", reviews: 45, orders: 105, bookings: 18 },
          { name: "Jun", reviews: 30, orders: 90, bookings: 15 },
          { name: "Jul", reviews: 52, orders: 85, bookings: 25 },
        ];
        resolve(mockMonthlyData);
      }, 1500);
    });
  };
  // --- End of Mock API Calls ---
  let data;

  const handleCount = async () => {
    const response = await axios.get("/api/count")
    data = response.data;
    console.log(response.data)
  };

  useEffect(() => {
    // Fetch both sets of data concurrently when the component mounts.
    // backendData();
    const getDashboardData = async () => {
      try {
        const [summary, monthly] = await Promise.all([
          fetchSummaryData(),
          fetchMonthlyData(),
        ]);
        setDashboardData(summary);
        setMonthlyData(monthly);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDashboardData();
  }, []);

  // Helper function for the rating breakdown percentage
  const getRatingPercentage = (ratingCount: number, total: number) => {
    return total > 0 ? (ratingCount / total) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-[#efa765]" />
        <span className="ml-4 text-xl">Loading Dashboard...</span>
      </div>
    );
  }

  if (!dashboardData || !monthlyData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500">
        <span className="text-xl">
          Failed to load dashboard data. Please try again.
        </span>
      </div>
    );
  }

  return (
    <>
      {/* <Reviews /> */}
      <h1 className="first-heading sm:text-5xl font-bold text-[#efa765] text-center">
        Admin Dashboard
      </h1>
      <div className="min-h-screen bg-gray-950 p-6 rounded-xl sm:p-10 text-white font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="mt-2 second-heading text-2xl text-gray-400">
              Analytics & Key Metrics
            </p>
          </div>

          <OverviewCards data={data} />
    <button className="btn btn-primary" onClick={handleCount}>count data</button>

          <ReviewsChart />
        </div>
      </div>
      {/* Pages */}
      <div className="min-h-screen bg-[#141f2d] p-8 text-white">
        <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl font-bold text-center mb-12 drop-shadow-lg second-heading">
          Admin Pages
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Menu Management Card */}
          <Link href="/admin/menu-management" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Utensils className="mr-3 h-7 w-7" /> Menu Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Manage menu categories and their associated products.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Product Management Card */}
          <Link href="/admin/product-management" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Box className="mr-3 h-7 w-7" /> Product Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Oversee all individual products, inventory, and pricing.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Contact Messages Card */}
          <Link href="/admin/messages" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <MessageSquare className="mr-3 h-7 w-7" /> Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Review and respond to inquiries from the contact form.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Order Management Card */}
          <Link href="/admin/orders" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <ListOrdered className="mr-3 h-7 w-7" /> Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  View and manage all customer orders.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* User Reviews Card */}
          <Link href="/admin/reviews" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Star className="mr-3 h-7 w-7" /> User Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  View and manage customer feedback and ratings.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Booked Tables Card */}
          <Link href="/admin/bookings" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <CalendarCheck className="mr-3 h-7 w-7" /> Booked Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Manage and track all table reservations.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
