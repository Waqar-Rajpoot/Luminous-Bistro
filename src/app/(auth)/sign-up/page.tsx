"use client";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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
import { signUpSchema } from "@/schemas/SignUpSchema";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { checkPasswordStrength } from "@/lib/passwordStrength";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    status: "",
    color: "#ddd",
    feedback: [],
  });

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    const strength: any = checkPasswordStrength(passwordValue);
    setPasswordStrength(strength);
  }, [passwordValue]);

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/username-uniqueness?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          setUsernameMessage(
            axiosError.response?.data?.message ??
              "An error occurred while checking username uniqueness."
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);

      const { emailType } = response.data;
      console.log("emailType in sign up page", emailType);
      router.replace(`/verify/${username}?emailType=${emailType}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data?.message ?? "An error occurred while sign up."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
        <h2 className="second-heading mb-6 text-center">Sign up</h2>
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="varela-round block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="varela-round block text-sm font-medium"
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="text"
                      required
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                  >
                    { username ? usernameMessage : ""}
                  </p>
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
                      placeholder="Enter your email"
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
                    className="varela-round block text-sm font-medium"
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
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden relative">
                    <div
                      id="password-strength-bar"
                      className="h-full rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{
                        width: `${passwordStrength.score}%`,
                        backgroundColor: passwordStrength.color,
                        transition:
                          "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
                      }}
                    >
                      {passwordValue.length > 0 && `${passwordStrength.score}%`}
                    </div>
                  </div>
                  <p
                    id="password-strength-text"
                    className={`text-xs mt-1 font-semibold`}
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordValue.length > 0 && `${passwordStrength.status}: `}
                    <span className="font-normal text-gray-600">
                      {passwordStrength.feedback.length > 0 &&
                        `Needs ${passwordStrength.feedback.join(", ")}`}
                    </span>
                  </p>
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
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please wait
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm text">
            Already have an account?
            <Link
              href="/sign-in"
              className="hover:underline"
              style={{ color: "rgb(239, 167, 101)" }}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
