import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MatricsCards from "@/components/user-dashboard/MatricsCards";
import {
  PastBookingsTable,
  PastOrdersTable,
} from "@/components/user-dashboard/PastData";
import { UserBookings } from "@/components/user-dashboard/UserBookings";
import { UserMessages } from "@/components/user-dashboard/UserMessages";
import { UserOrders } from "@/components/user-dashboard/UserOrders";
import { UserProfile } from "@/components/user-dashboard/UserProfile";
import { UserReviews } from "@/components/user-dashboard/UserReviews";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }

  try {
    const userId = session.user._id;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/${userId}`
    );
    console.log("Fetch response status:", res);
    const dashboardData = await res.json();

    if (!res.ok) {
      throw new Error(
        dashboardData.message || "Failed to fetch dashboard data"
      );
    }

    const {
      user,
      latestOrders,
      recentOrders,
      latestBookings,
      recentBookings,
      reviews,
      messages,
    } = dashboardData;

    return (
      <div className="min-h-screen p-8 bg-slate-900 text-white font-sans">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <section>
            <UserProfile user={user} />
          </section>
          <section>
            <div className="mb-8">
              <MatricsCards
                latestOrders={latestOrders}
                latestBookings={latestBookings}
                reviews={reviews}
                messages={messages}
              />
            </div>
          </section>
          <section>
            <hr className="border-slate-700 my-8" />
          </section>
          <section>
            <h2 className="font-bold text-[#EFA765] mb-4 third-heading">
              Recent Activity
            </h2>
            <p className="text-gray-400 mb-6">
              Here is a summary of your most recent orders, bookings, reviews,
              and messages.
            </p>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserOrders orders={recentOrders} />
            <UserBookings bookings={recentBookings} />
          </section>
          <hr className="border-slate-700 my-8" />
          <section>
            <h2 className="font-bold text-[#EFA765] mb-4 third-heading">
              All Activities
            </h2>
            <p className="text-gray-400 mb-6">
              Here are your past orders and bookings for your reference.
            </p>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PastOrdersTable latestOrders={latestOrders} />
            <PastBookingsTable latestBookings={latestBookings} />
          </section>
          <section>
            <hr className="border-slate-700 my-8" />
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserReviews reviews={reviews} />
            <UserMessages messages={messages} />
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Server-side data fetching error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl text-red-500">{error.message}</div>
      </div>
    );
  }
}