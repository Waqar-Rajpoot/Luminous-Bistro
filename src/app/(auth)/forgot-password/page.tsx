"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { Loader2 } from "lucide-react";
import { emailSchema } from "@/schemas/emailSchema";



const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/forgot-password", {
        email: data.email,
      });

      toast.success(response.data.message);
        const { username, emailType } = response.data;
        console.log("username and emailType in forgot password page", username, emailType);
      router.replace(`/verify/${username}?emailType=${emailType}`);

    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
        <h2 className="second-heading mb-6 text-center">Forgot Password</h2>
        <p className="text-center mb-6 text-sm text-gray-500">
          Enter the email address associated with your account and we will send you a password reset code.
        </p>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="text"
                      required
                      type="email"
                    />
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
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Please wait
                </>
              ) : "Send Reset Code"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm text">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="hover:underline"
              style={{ color: "rgb(239, 167, 101)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
