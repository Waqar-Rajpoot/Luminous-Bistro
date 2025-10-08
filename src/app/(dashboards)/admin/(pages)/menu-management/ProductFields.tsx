// components/menu-management/ProductFields.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MenuFormInputs } from "./MenuManagementPage"; // Adjust path as needed

interface ProductFieldsProps {
  form: UseFormReturn<MenuFormInputs>;
  productNumber: 1 | 2 | 3 | 4;
  defaultName: string;
}

const ProductFields: React.FC<ProductFieldsProps> = ({ form, productNumber, defaultName }) => {
  const nameField = `p${productNumber}name` as keyof MenuFormInputs;
  const priceField = `p${productNumber}price` as keyof MenuFormInputs;

  return (
    <div className="space-y-4">
      <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">
        Product {productNumber} Details
      </h3>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <FormField
          control={form.control}
          name={nameField}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-[#efa765]">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={defaultName}
                  {...field}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={priceField}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  // Handle number conversion for price fields
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? 0
                        : parseFloat(e.target.value)
                    )
                  }
                  className="bg-gray-700 text-white border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProductFields;