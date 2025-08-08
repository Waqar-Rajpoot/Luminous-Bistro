// src/app/admin/reviews/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
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
import { IReview } from '@/models/Review.model'; // Assuming IReview is exported from your model
import { format } from 'date-fns'; // Import format for date display

// Type for API response errors
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // For individual review actions

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/reviews');
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch reviews.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleApproval = async (reviewId: string, currentStatus: boolean) => {
    setIsActionLoading(true); // Disable buttons during action
    try {
      const response = await axios.patch(`/api/reviews/${reviewId}`, {
        isApproved: !currentStatus,
      });
      toast.success(response.data.message);
      // Update the specific review in the state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? { ...review, isApproved: !currentStatus } : review
        )
      );
    } catch (error) {
      console.error('Failed to update review status:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update review status.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsActionLoading(true); // Disable buttons during action
    try {
      const response = await axios.delete(`/api/reviews/${reviewId}`);
      toast.success(response.data.message);
      // Remove the deleted review from the state
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to delete review.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-xl text-white">
      <h1 className="text-4xl font-bold mb-6 text-[#efa765]">User Reviews Management</h1>
      <p className="text-lg mb-8">
        Review, approve, or delete customer feedback submitted through your website.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
          <p className="ml-4 text-xl">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center p-8 border border-gray-700 rounded-md text-gray-400">
          <p className="text-xl">No reviews found yet.</p>
        </div>
      ) : (
        <div className="space-y-6"> {/* Changed from table to a flex column with spacing */}
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`
                bg-gray-700 p-6 rounded-lg shadow-md border w-full // Full width card
                ${review.isApproved ? 'border-gray-600' : 'border-[#efa765] ring-1 ring-[#efa765]'}
                flex flex-col justify-between
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white truncate mr-4">
                    {review.name}
                  </h2>
                  <Badge variant={review.isApproved ? 'default' : 'destructive'} className="px-3 py-1 text-sm">
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Email:</span> {review.email}
                </p>
                <p className="text-yellow-400 text-lg mb-3">
                  {'★'.repeat(review.rating)}
                </p>
                <p className="text-gray-400 text-base mb-4 line-clamp-4"> {/* Display truncated review preview */}
                  {review.review}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-600">
                <span>
                  Submitted: {format(new Date(review.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
                <div className="flex space-x-2">
                  {/* Toggle Approval Button */}
                  <Button
                    variant={review.isApproved ? 'destructive' : 'default'}
                    size="icon" // Use icon size for compact buttons
                    onClick={() => handleToggleApproval(review._id, review.isApproved)}
                    disabled={isActionLoading}
                    className="h-8 w-8" // Fixed size for icon buttons
                    style={{ backgroundColor: review.isApproved ? '#dc2626' : '#22c55e' }} // Red for Unapprove, Green for Approve
                  >
                    {isActionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {!isActionLoading && (review.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />)}
                    <span className="sr-only">{review.isApproved ? 'Unapprove' : 'Approve'}</span>
                  </Button>

                  {/* Delete Review Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon" // Use icon size for compact buttons
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
                          This action cannot be undone. This will permanently delete the review from your database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteReview(review._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
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