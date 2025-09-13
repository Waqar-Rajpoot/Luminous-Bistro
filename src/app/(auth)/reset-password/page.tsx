"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";


const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get username and code from URL query parameters
  const username = searchParams.get("username");
  const code = searchParams.get("code");

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (!username || !code) {
        toast.error("Invalid request. Missing username or verification code.");
        router.replace("/forgot-password");
        return;
      }

      const resetData = {
        username: username,
        code: code,
        newPassword: data.newPassword,
      };

      // Call the backend API to reset the password
      const response = await axios.post("/api/reset-password", resetData);

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Password reset error:", error);
      const axiosError = error as AxiosError;
      toast.error(
        axiosError.response?.data?.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
        <h2 className="second-heading mb-6 text-center">Reset Your Password</h2>
        <p className="text-center mb-6 text-sm text-gray-500">
          Enter your new password below.
        </p>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter a new password"
                        {...field}
                        className="text pr-10"
                        type={showPassword ? "text" : "password"}
                        required
                      />
                      <button
                        className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm new password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="text pr-10"
                        required
                      />
                      <button
                        className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
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
              ) : (
                "Reset Password"
              )}
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

export default ResetPassword;
