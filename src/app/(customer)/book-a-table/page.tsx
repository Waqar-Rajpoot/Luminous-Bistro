"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { bookingSchema } from "@/schemas/bookingSchema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { useSession } from "next-auth/react";

export default function BookATablePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      requests: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    setIsSubmitting(true);

    if (!session) {
      setIsSubmitting(false);
      toast.error("Please sign in to book a table.");
      router.push("/sign-in");
      return;
    }

    // console.log('Booking Details:', data);

    data = {
      ...data,
      userId: session.user._id,
    };

    try {
      const response = await axios.post("/api/bookingTable", data);
      toast.success(response.data.message, {
        description: `Booking for ${data.guests} guests on ${data.date} at ${data.time}.`,
        duration: 5000,
      });

      form.reset();
      router.replace("/");
    } catch (error) {
      console.error("Booking failed:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message ?? "An error occurred while booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-dark-background font-sans overflow-hidden">
      <div className="text-center my-16 space-y-4">
        <p className="font-yeseva-one third-heading text-[#efa765] leading-tight drop-shadow-sm">
          Where every moment becomes a cherished memory of love ❤
        </p>
        <p className="text-[#efa765] text-text-light text-lg italic font-sans opacity-90">
          Join us for an evening crafted with passion, flavor, and warmth, where
          laughter flows as freely as fine wine, and every dish tells a story of
          love.
        </p>
      </div>
      <div className="absolute inset-0 bg-dark-background/80 z-10"></div>

      <div className="relative z-20 max-w-3xl w-full bg-card-background/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-[#efa765] overflow-hidden transform transition-all duration-300">
        <h1 className="second-heading font-yeseva-one text-fast-food-orange text-80px leading-112px text-center mb-8 md:mb-12 drop-shadow-lg">
          Book Your Table
        </h1>

        <p className="text text-center mb-8">
          Experience the authentic taste of premium steaks. Reserve your spot
          now!
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="varela-round block text-sm font-medium"
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        className="text"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="varela-round block text-sm font-medium"
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        type="email"
                        className="text"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="varela-round block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="varela-round block text-sm font-medium"
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input required className="text" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="varela-round block text-sm font-medium"
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        className='text placeholder="HH:MM"'
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="varela-round block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Number of Guests
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text"
                      type="number"
                      placeholder="2"
                      min={1}
                      max={20}
                      {...field}
                      onChange={(e) => {
                        const valueAsNumber = e.target.valueAsNumber;
                        field.onChange(isNaN(valueAsNumber) ? null : valueAsNumber);
                      }}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="varela-round block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Special Requests (Optional)
                  </FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      placeholder="e.g., anniversary celebration, high chair needed"
                      {...field}
                      className="text w-full py-2.5 px-4 bg-input-bg border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow resize-y"
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
              style={{
                backgroundColor: "rgb(239, 167, 101)",
                color: "rgb(20, 31, 45)",
              }}
            >
              {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ) : "Book a Table"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm text">
            Return to home?{" "}
            <Link
              href="/"
              className="hover:underline"
              style={{ color: "rgb(239, 167, 101)" }}
            >
              Home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
