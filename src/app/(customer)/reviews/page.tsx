'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner'; 
import { Loader2 } from 'lucide-react'; 
import axios, { AxiosError } from 'axios';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { reviewSchema } from '@/schemas/reviewSchema';
import { useRouter } from 'next/navigation';
import { ErrorResponse } from '@/utils/ErrorResponse';
import { useSession } from 'next-auth/react';


type ReviewFormInputs = z.infer<typeof reviewSchema>;

export default function ReviewsPage() {
  const router = useRouter();
  const { data: session} = useSession();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormInputs>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 5,
      review: '',
    },
  });
  const handleSubmitReview = async (data: ReviewFormInputs) => {
    setIsSubmitting(true); 

    if (!session) {
      setIsSubmitting(false);
      toast.error('Please sign in to submit a review.');
      router.push('/sign-in');
      return;
    }

    data = {
      ...data,
      user: session.user._id,
    };

    // console.log('Review Submission Details:', data);

    try {
      const response = await axios.post('/api/reviews', data);
      toast.success(response.data.message || 'Thank you for your review!', {
        description: `Rating: ${data.rating} stars.`,
        duration: 5000,
      });
      form.reset();
      router.replace('/');
    } catch (error) {
      console.error('Review submission failed:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to submit your review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 bg-dark-background font-sans overflow-hidden">
      <div className="text-center mb-12 py-8 space-y-4">
        <p className="third-heading font-yeseva-one text-fast-food-orange text-3xl-plus leading-tight drop-shadow-sm">
          Your words are the heart ❤ of our growth.
        </p>
        <p className="text-[#efa765] text-text-light text-lg italic font-sans opacity-90">
          Every review you share helps us craft even more delightful moments for you.
          Thank you for being a cherished part of our journey.
        </p>
      </div>
      <div className="absolute inset-0 bg-dark-background/80 z-10"></div>

      <div className="relative z-20 max-w-xl w-full bg-card-background/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-[#efa765] overflow-hidden transform transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>

        <h1 className="second-heading font-yeseva-one text-fast-food-orange text-80px leading-112px text-center mb-8 md:mb-12 drop-shadow-lg">
          Submit a Review
        </h1>

        <p className="text-white text-center text-text-light text-lg md:text-xl mb-12 font-sans font-light max-w-3xl mx-auto">
          We love to hear about your experience! Your feedback helps us improve.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765] block text-sm font-sans mb-2">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                    />
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
                  <FormLabel className="text-[#efa765] block text-sm font-sans mb-2">Your Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765] block text-sm font-sans mb-2">Rating (1-5 Stars)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      min={1}
                      max={5}
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765] block text-sm font-sans mb-2">Your Review</FormLabel>
                  <FormControl>
                    <textarea
                      rows={6}
                      placeholder="Share your experience with us..."
                      {...field}
                      className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow resize-y"
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
              style={{
                backgroundColor: "rgb(239, 167, 101)",
                color: "rgb(20, 31, 45)",
              }}
              disabled={isSubmitting} 
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : 'Submit Review'}
            </Button>
          </form>
        </Form>

        <p className="text text-center text-text-muted text-sm mt-6 font-sans">
          Your feedback is invaluable to us. Thank you!
        </p>
      </div>
    </div>
  );
}
