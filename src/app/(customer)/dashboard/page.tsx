"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  User, Mail, CalendarCheck, ShoppingCart, Star, Loader2,
  Edit, Save, XCircle, MapPin, Phone, Lock, Eye, EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// --- Interfaces for Data ---

// Extend the default Session type to include user ID
interface CustomSession {
  user?: {
    id?: string;
    sub?: string; // Common alternative for user ID
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// User Profile Data Interface (what we expect from /api/user/profile)
interface IUserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  address?: string; // Optional field
  phone?: string;   // Optional field
  // Add other fields relevant to user profile, but not sensitive like password hash
}

// Activity Data Interfaces (simplified for dashboard display)
interface IReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface IContactMessage {
  _id: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface IBooking {
  _id: string;
  tableNumber: number;
  bookingTime: string; // ISO string
  partySize: number;
  createdAt: string;
}

interface IOrder {
  _id: string;
  totalPrice: number;
  status: string;
  orderDate: string; // ISO string
  products: Array<{
    productId: string;
    name: string; // Assuming product name is embedded or populated
    quantity: number;
    priceAtPurchase: number;
  }>;
}

// Zod Schema for User Profile Update Form
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  phone: z.string().optional(),
  // Password fields are handled separately for security
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmNewPassword) {
    if (!data.currentPassword) {
      throw new z.ZodError([{
        path: ['currentPassword'],
        message: 'Current password is required to change password.',
        code: z.ZodIssueCode.custom
      }]);
    }
    if (data.newPassword !== data.confirmNewPassword) {
      throw new z.ZodError([{
        path: ['confirmNewPassword'],
        message: 'New passwords do not match.',
        code: z.ZodIssueCode.custom
      }]);
    }
    if (data.newPassword && data.newPassword.length < 6) {
      throw new z.ZodError([{
        path: ['newPassword'],
        message: 'New password must be at least 6 characters.',
        code: z.ZodIssueCode.custom
      }]);
    }
  }
  return true;
}, {
  message: "New passwords do not match.",
  path: ["confirmNewPassword"],
});

type ProfileFormInputs = z.infer<typeof profileSchema>;


const UserDashboard = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: 'loading' | 'authenticated' | 'unauthenticated' };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Data States
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [userReviews, setUserReviews] = useState<IReview[]>([]);
  const [userContactMessages, setUserContactMessages] = useState<IContactMessage[]>([]);
  const [userBookings, setUserBookings] = useState<IBooking[]>([]);
  const [userOrders, setUserOrders] = useState<IOrder[]>([]);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


  // React Hook Form for Profile Update
  const form = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      address: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onChange', // Validate on change
  });

  // Populate form with user data when it loads or changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        username: userProfile.username,
        email: userProfile.email,
        address: userProfile.address || '',
        phone: userProfile.phone || '',
        currentPassword: '', // Always reset password fields
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  }, [userProfile, form]);


  // --- Data Fetching Effect ---
  useEffect(() => {
    if (status === 'loading') return; // Do nothing while session is loading

    if (!session || !session.user || (!session.user.id && !session.user.sub)) {
      toast.error('You must be logged in to view your dashboard.');
      router.push('/sign-in');
      return;
    }

    const userId = session.user.id || session.user.sub; // Get the user's ID

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all user-specific data concurrently
        const [
          profileRes,
          reviewsRes,
          contactMessagesRes,
          bookingsRes,
          ordersRes
        ] = await Promise.all([
          axios.get(`/api/user/profile?userId=${userId}`), // API for user's own profile
          axios.get(`/api/reviews/user?userId=${userId}`), // API for user's reviews
          axios.get(`/api/contact-messages/user?userId=${userId}`), // API for user's contact messages
          axios.get(`/api/bookings/user?userId=${userId}`), // API for user's bookings
          axios.get(`/api/orders/user?userId=${userId}`) // API for user's orders
        ]);

        setUserProfile(profileRes.data.user);
        setUserReviews(reviewsRes.data.reviews || []);
        setUserContactMessages(contactMessagesRes.data.messages || []);
        setUserBookings(bookingsRes.data.bookings || []);
        setUserOrders(ordersRes.data.orders || []);

      } catch (err: any) {
        console.error("Failed to fetch user dashboard data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]); // Re-run if session or status changes


  // --- Profile Update Handler ---
  const handleProfileUpdate = async (values: ProfileFormInputs) => {
    setIsEditingProfile(true);
    try {
      const payload: Partial<ProfileFormInputs> = {
        name: values.name,
        username: values.username,
        email: values.email,
        address: values.address,
        phone: values.phone,
      };

      // Only include password fields if they are being changed
      if (values.currentPassword && values.newPassword && values.confirmNewPassword) {
        payload.currentPassword = values.currentPassword;
        payload.newPassword = values.newPassword;
        payload.confirmNewPassword = values.confirmNewPassword;
      }

      const response = await axios.patch('/api/user/profile', payload);
      setUserProfile(response.data.user); // Update local state with new profile data
      toast.success(response.data.message || 'Profile updated successfully!');
      setIsEditingProfile(false);
      form.reset(values); // Reset form with updated values (clears password fields)
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsEditingProfile(false);
    }
  };


  // --- Render Logic ---
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-[#efa765]" />
        <span className="ml-4 text-xl">Loading User Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-red-500">
        <span className="text-xl">Error: {error}</span>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-400">
        <span className="text-xl">No user data found. Please log in.</span>
      </div>
    );
  }

  // Analytics Calculations
  const totalReviews = userReviews.length;
  const averageRating = totalReviews > 0
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;
  const totalContactMessages = userContactMessages.length;
  const totalBookings = userBookings.length;
  const totalOrders = userOrders.length;
  const totalRevenue = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);


  return (
    <div className="min-h-screen bg-gray-950 p-6 sm:p-10 text-white font-sans">
      <Toaster richColors position="top-center" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#efa765] text-center mb-8">
          Welcome, {userProfile.name || userProfile.username}!
        </h1>
        <p className="text-lg text-gray-400 text-center mb-12">
          Your personalized dashboard.
        </p>

        {/* --- Overview Analytics Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-[#efa765]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Total products purchased</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-[#efa765]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">From your orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Reviews</CardTitle>
              <Star className="h-5 w-5 text-[#efa765]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReviews.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Avg. Rating: {averageRating.toFixed(1)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Bookings</CardTitle>
              <CalendarCheck className="h-5 w-5 text-[#efa765]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBookings.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Tables reserved</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Messages</CardTitle>
              <Mail className="h-5 w-5 text-[#efa765]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalContactMessages.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Inquiries sent</p>
            </CardContent>
          </Card>
        </div>

        {/* --- Profile Management Section --- */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#efa765] flex items-center">
              <User className="h-6 w-6 mr-2" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Name</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white" {...field} disabled={!isEditingProfile} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Username</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white" {...field} disabled={!isEditingProfile} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Email</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white" {...field} disabled={true} /> {/* Email usually not editable */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Address</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white" {...field} disabled={!isEditingProfile} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Phone</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white" {...field} disabled={!isEditingProfile} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Change Fields (only visible when editing) */}
                {isEditingProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-gray-700 pt-6">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                className="bg-gray-700 border-gray-600 text-white pr-10"
                                {...field}
                              />
                              <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                className="bg-gray-700 border-gray-600 text-white pr-10"
                                {...field}
                              />
                              <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmNewPassword ? "text" : "password"}
                                className="bg-gray-700 border-gray-600 text-white pr-10"
                                {...field}
                              />
                              <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                              >
                                {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}


                <div className="flex justify-end space-x-4 mt-6">
                  {!isEditingProfile ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-[#efa765] text-gray-900 hover:bg-[#efa765]/80"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          form.reset(userProfile || {}); // Reset to original values
                        }}
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* --- Recent Activities Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#efa765] flex items-center">
                <ShoppingCart className="h-6 w-6 mr-2" /> Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length > 0 ? (
                <ul className="space-y-4">
                  {userOrders.slice(0, 3).map(order => ( // Show up to 3 recent orders
                    <li key={order._id} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{order.products.map(p => p.name).join(', ')}</p>
                        <p className="text-sm text-gray-400">Total: ${order.totalPrice.toFixed(2)}</p>
                      </div>
                      <Badge className="bg-[#efa765] text-gray-900">{order.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No recent orders found.</p>
              )}
              {totalOrders > 3 && (
                <div className="text-right mt-4">
                  <Link href="/dashboard/orders" className="text-[#efa765] hover:underline">
                    View All Orders &rarr;
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#efa765] flex items-center">
                <Star className="h-6 w-6 mr-2" /> Your Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userReviews.length > 0 ? (
                <ul className="space-y-4">
                  {userReviews.slice(0, 3).map(review => ( // Show up to 3 recent reviews
                    <li key={review._id} className="p-3 bg-gray-700 rounded-md">
                      <div className="flex items-center mb-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - review.rating }, (_, i) => (
                          <Star key={i + review.rating} className="h-4 w-4 text-gray-500" />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300 italic">"{review.comment.substring(0, 100)}{review.comment.length > 100 ? '...' : ''}"</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">You haven't submitted any reviews yet.</p>
              )}
              {totalReviews > 3 && (
                <div className="text-right mt-4">
                  <Link href="/dashboard/reviews" className="text-[#efa765] hover:underline">
                    View All Reviews &rarr;
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#efa765] flex items-center">
                <CalendarCheck className="h-6 w-6 mr-2" /> Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBookings.length > 0 ? (
                <ul className="space-y-4">
                  {userBookings.slice(0, 3).map(booking => ( // Show up to 3 recent bookings
                    <li key={booking._id} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Table: {booking.tableNumber} (Party of {booking.partySize})</p>
                        <p className="text-sm text-gray-400">Time: {new Date(booking.bookingTime).toLocaleString()}</p>
                      </div>
                      <Badge className="bg-[#efa765] text-gray-900">Confirmed</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No recent bookings found.</p>
              )}
              {totalBookings > 3 && (
                <div className="text-right mt-4">
                  <Link href="/dashboard/bookings" className="text-[#efa765] hover:underline">
                    View All Bookings &rarr;
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Contact Messages */}
          <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#efa765] flex items-center">
                <Mail className="h-6 w-6 mr-2" /> Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userContactMessages.length > 0 ? (
                <ul className="space-y-4">
                  {userContactMessages.slice(0, 3).map(message => ( // Show up to 3 recent messages
                    <li key={message._id} className="p-3 bg-gray-700 rounded-md">
                      <p className="font-semibold text-gray-200">{message.subject}</p>
                      <p className="text-sm text-gray-400 italic">"{message.message.substring(0, 80)}{message.message.length > 80 ? '...' : ''}"</p>
                      <span className="text-xs text-gray-500 block mt-1">{new Date(message.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">You haven't sent any contact messages yet.</p>
              )}
              {totalContactMessages > 3 && (
                <div className="text-right mt-4">
                  <Link href="/dashboard/messages" className="text-[#efa765] hover:underline">
                    View All Messages &rarr;
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
