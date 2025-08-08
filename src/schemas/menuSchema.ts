import * as z from "zod";

export const menuSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  p1name: z.string().min(1, { message: "Product name is required." }),
  p1price: z
    .number()
    .min(0.01, { message: "Price must be greater than 0." })
    .max(1000000, { message: "Price too high." }),
  p2name: z.string().min(1, { message: "Product name is required." }),
  p2price: z
    .number()
    .min(0.01, { message: "Price must be greater than 0." })
    .max(1000000, { message: "Price too high." }),
  p3name: z.string().min(1, { message: "Product name is required." }),
  p3price: z
    .number()
    .min(0.01, { message: "Price must be greater than 0." })
    .max(1000000, { message: "Price too high." }),
  p4name: z.string().min(1, { message: "Product name is required." }),
  p4price: z
    .number()
    .min(0.01, { message: "Price must be greater than 0." })
    .max(1000000, { message: "Price too high." }),
  imageSrc: z.string().min(1, { message: "Product image is required." }),
});
