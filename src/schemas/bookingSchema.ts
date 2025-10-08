import { z } from "zod";
// Define the Zod Schema for the Booking Form
export const bookingSchema = z.object({
  name: z.string().min(2, "Full Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z
    .string()
    .min(10, "Phone number is required and must be at least 10 digits.")
    .regex(/^\+?[0-9\s-()]{10,20}$/, "Invalid phone number format."),
  date: z
    .string()
    .min(1, "Date is required.")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Cannot book for past dates."),
  time: z.string().min(1, "Time is required."),
  guests: z
    .number()
    .min(1, "At least 1 guest is required.")
    .max(20, "Maximum 20 guests per booking."), 
  requests: z
    .string()
    .max(200, "Special requests limited to 200 characters.")
    .optional(),
  isConfirmed: z.boolean().default(false).optional(),
  userId: z.string().optional(),
});
