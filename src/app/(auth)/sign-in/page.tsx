"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
    }

    if (result?.url) {
      router.replace("/");
    }

    setIsSubmitting(false);
  };
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
        <h2 className="second-heading mb-6 text-center">Sign in</h2>
        <Form {...form}>
          <form
            action=""
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email/username"
                      {...field}
                      className="text"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="text pr-10"
                      required
                    />
                    <button
                      className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                    </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm hover:underline"
                style={{ color: "rgb(239, 167, 101)" }}
              >
                Forgot Password?
              </Link>
            </div>
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
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm text">
            If you have not account?{" "}
            <Link
              href="/sign-up"
              className="hover:underline"
              style={{ color: "rgb(239, 167, 101)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
