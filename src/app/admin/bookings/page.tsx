'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, CalendarCheck, CalendarX, Trash2, Users, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IBooking } from '@/models/Booking.model'; // Import the IBooking interface you defined

// Type for API response errors (assuming you have this in src/utils/ErrorResponse.ts)
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // For individual booking actions

  // Function to fetch all bookings
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/bookingTable');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // Re-run if fetchBookings reference changes (which it won't due to useCallback)

  // Function to toggle booking confirmation status
  const handleToggleConfirmation = async (bookingId: string, currentStatus: boolean) => {
    setIsActionLoading(true); // Disable buttons during action
    try {
      const response = await axios.patch(`/api/bookingTable/${bookingId}`, {
        isConfirmed: !currentStatus, // Toggle the status
      });
      toast.success(response.data.message);
      // Update the local state to reflect the change
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, isConfirmed: !currentStatus } : booking
        )
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update booking status.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Function to delete a booking
  const handleDeleteBooking = async (bookingId: string) => {
    setIsActionLoading(true); // Disable buttons during action
    try {
      const response = await axios.delete(`/api/bookingTable/${bookingId}`);
      toast.success(response.data.message);
      // Remove the deleted booking from the local state
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error('Failed to delete booking:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to delete booking.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-xl text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-[#efa765]">Booked Tables Management</h1>
      <p className="text-lg mb-8 text-gray-300">
        Oversee all table reservations. Confirm, mark as pending, or cancel bookings.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
          <p className="ml-4 text-xl text-gray-400">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center p-8 border border-gray-700 rounded-md text-gray-400">
          <p className="text-xl">No table bookings found yet.</p>
        </div>
      ) : (
        <div className="space-y-6"> {/* Full-width cards, stacked vertically */}
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`
                bg-gray-700 p-6 rounded-lg shadow-md border w-full
                ${booking.isConfirmed ? 'border-gray-600' : 'border-[#efa765] ring-1 ring-[#efa765]'}
                flex flex-col justify-between
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white truncate mr-4">
                    Booking for: {booking.name}
                  </h2>
                  <Badge className={`px-3 py-1 text-sm ${booking.isConfirmed ? 'bg-green-600' : 'bg-orange-500'}`}>
                    {booking.isConfirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Email:</span> {booking.email}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Phone:</span> {booking.phone}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Date:</span> {format(new Date(booking.date + 'T00:00:00'), 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Time:</span> {booking.time}
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  <span className="font-medium text-[#efa765]">Guests:</span> {booking.guests} <Users className="inline-block h-4 w-4 ml-1 align-text-bottom" />
                </p>
                {booking.requests && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    <span className="font-medium text-[#efa765]">Requests:</span> {booking.requests}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-600">
                <span>
                  Booked: {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
                <div className="flex space-x-2">
                  {/* View Details Dialog (if requests are long) */}
                  {booking.requests && booking.requests.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:bg-blue-400/10">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 text-white border border-[#efa765]">
                        <DialogHeader>
                          <DialogTitle className="text-[#efa765]">Booking Details for {booking.name}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Date: {format(new Date(booking.date + 'T00:00:00'), 'MMM dd, yyyy')} | Time: {booking.time} | Guests: {booking.guests}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-gray-700 rounded-md text-gray-200 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                          <p className="font-semibold text-[#efa765] mb-2">Special Requests:</p>
                          {booking.requests || "No special requests."}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Toggle Confirmation Button */}
                  <Button
                    size="icon"
                    onClick={() => handleToggleConfirmation(booking._id, booking.isConfirmed)}
                    disabled={isActionLoading}
                    className="h-8 w-8"
                    style={{ backgroundColor: booking.isConfirmed ? 'rgb(220, 38, 38)' : 'rgb(34, 197, 94)' }} /* Tailwind red-600 & green-500 */
                  >
                    {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      booking.isConfirmed ? <CalendarX className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />
                    )}
                    <span className="sr-only">{booking.isConfirmed ? 'Mark as Pending' : 'Confirm Booking'}</span>
                  </Button>

                  {/* Delete Booking Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isActionLoading}
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          This action cannot be undone. This will permanently delete the booking from your database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}