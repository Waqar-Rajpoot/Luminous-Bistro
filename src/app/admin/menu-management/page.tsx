// // app/admin/new-product/page.tsx
// "use client";

// import React, { useState } from "react";
// import FileUpload from "@/components/FileUpload"; // Adjust path as needed
// import { toast } from "sonner"; // For notifications
// import { Loader2 } from "lucide-react";
// import Image from "next/image";

// export default function NewProductForm() {
//   const [productName, setProductName] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [productDescription, setProductDescription] = useState("");
//   const [productCategory, setProductCategory] = useState("");
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleImageUploadSuccess = (url: string) => {
//     setImageUrl(url);
//     toast.success("Image uploaded successfully! URL: " + url);
//     setUploadProgress(0); // Reset progress after success
//   };

//   const handleImageUploadProgress = (progress: number) => {
//     setUploadProgress(progress);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!imageUrl) {
//       toast.error("Please upload an image for the product.");
//       setIsSubmitting(false);
//       return;
//     }

//     const newProduct = {
//       name: productName,
//       price: parseFloat(productPrice),
//       description: productDescription,
//       category: productCategory,
//       imageSrc: imageUrl,
//     };

//     try {
//       // Here you would send this data to your /api/products POST endpoint
//       const response = await fetch("/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add product.");
//       }

//       toast.success("Product added successfully!");
//       // Reset form fields
//       setProductName("");
//       setProductPrice("");
//       setProductDescription("");
//       setProductCategory("");
//       setImageUrl(null);
//     } catch (error: any) {
//       console.error("Error adding product:", error);
//       toast.error(error.message || "Failed to add product.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#141f2d] p-8 flex items-center justify-center">
//       <div className="bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765] w-full max-w-2xl">
//         <h1 className="yeseva-one text-fast-food-orange text-4xl text-center mb-8">Add New Product</h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="productName" className="block text-[#efa765] text-sm font-sans mb-2">
//               Product Name
//             </label>
//             <input
//               type="text"
//               id="productName"
//               value={productName}
//               onChange={(e) => setProductName(e.target.value)}
//               className="w-full py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#efa765]"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="productPrice" className="block text-[#efa765] text-sm font-sans mb-2">
//               Price (PKR)
//             </label>
//             <input
//               type="number"
//               id="productPrice"
//               value={productPrice}
//               onChange={(e) => setProductPrice(e.target.value)}
//               className="w-full py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#efa765]"
//               step="0.01"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="productCategory" className="block text-[#efa765] text-sm font-sans mb-2">
//               Category
//             </label>
//             <input
//               type="text"
//               id="productCategory"
//               value={productCategory}
//               onChange={(e) => setProductCategory(e.target.value)}
//               className="w-full py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#efa765]"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="productDescription" className="block text-[#efa765] text-sm font-sans mb-2">
//               Description
//             </label>
//             <textarea
//               id="productDescription"
//               value={productDescription}
//               onChange={(e) => setProductDescription(e.target.value)}
//               rows={3}
//               className="w-full py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#efa765] resize-y"
//               required
//             ></textarea>
//           </div>

//           {/* File Upload Component */}
//           <FileUpload
//             onSuccess={handleImageUploadSuccess}
//             onProgress={handleImageUploadProgress}
//             fileType="image" // Specify 'image' or 'video'
//             label="Upload Product Image"
//             disabled={isSubmitting} // Disable upload during form submission
//           />

//           {imageUrl && (
//             <div className="mt-4">
//               <p className="text-white text-sm">Image Preview:</p>
//               <Image src={imageUrl} alt="Uploaded Product" className="mt-2 max-w-xs h-auto rounded-lg border border-gray-600" />
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-md
//                        flex items-center justify-center"
//             style={{
//               backgroundColor: "rgb(239, 167, 101)",
//               color: "rgb(20, 31, 45)",
//             }}
//             disabled={isSubmitting || !imageUrl} // Disable if submitting or no image uploaded
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="animate-spin h-5 w-5 mr-3" /> Adding Product...
//               </>
//             ) : (
//               "Add Product"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }










// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// // Shadcn UI components
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import FileUpload from "@/components/MediaUploader"; 
// import { menuSchema } from "@/schemas/menuSchema";

// type ProductFormInputs = z.infer<typeof menuSchema>;

// export default function NewProductForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Initialize react-hook-form
//   const form = useForm<ProductFormInputs>({
//     resolver: zodResolver(menuSchema),
//     defaultValues: {
//       category: "",
//       p1name: "",
//       p1price: 0,
//       p2name: "",
//       p2price: 0,
//       p3name: "",
//       p3price: 0,
//       p4name: "",
//       p4price: 0,
//       imageSrc: "",
//     },
//   });

//   // This function will be called by react-hook-form on valid submission
//   const onSubmit = async (data: ProductFormInputs) => {
//     setIsSubmitting(true);
//     try {
//       // Send product data to your backend API
//       const response = await fetch("/api/menu", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add product.");
//       }

//       toast.success("Product added successfully!");
//       form.reset(); // Reset the form fields to defaultValues
//     } catch (error: any) {
//       console.error("Error adding product:", error);
//       toast.error(error.message || "Failed to add product.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#141f2d] p-8 flex items-center justify-center">
//       <div className="bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765] w-full max-w-2xl">
//         <h1 className="yeseva-one text-[rgb(239,167,101)] text-4xl text-center mb-8">
//           Add New Menu
//         </h1>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="category"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#efa765]">Item Category</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Burgers" 
//                     {...field} 
//                     required
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex flex-wrap">
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p1name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                         Product One Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Delicious Burger"
//                           {...field}
//                           required
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p1price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                       Product One Price (PKR)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="999.00"
//                           {...field}
//                           required
//                           onChange={(e) => {
//                             field.onChange(
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value)
//                             );
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap">
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p2name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                         Product Two Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Zinger Burger"
//                           {...field}
//                           required
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p2price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                       Product Two Price (PKR)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="999.00"
//                           {...field}
//                           required
//                           onChange={(e) => {
//                             field.onChange(
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value)
//                             );
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap">
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p3name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                         Product Three Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Veggie Burger"
//                           {...field}
//                           required
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p3price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                       Product Three Price (PKR)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="999.00"
//                           {...field}
//                           required
//                           onChange={(e) => {
//                             field.onChange(
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value)
//                             );
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap">
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p4name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                         Product Four Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Swiss Burger"
//                           {...field}
//                           required
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="w-1/2 pr-2">
//                 <FormField
//                   control={form.control}
//                   name="p4price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[#efa765]">
//                       Product Four Price (PKR)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="999.00"
//                           {...field}
//                           required
//                           onChange={(e) => {
//                             field.onChange(
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value)
//                             );
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <FormField
//               control={form.control}
//               name="imageSrc"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#efa765]">
//                     Product Image
//                   </FormLabel>
//                   <FormControl>
//                     {/* FileUpload component now takes field.onChange and field.value */}
//                     <FileUpload
//                       onChange={field.onChange}
//                       value={field.value}
//                       name={field.name}
//                       disabled={isSubmitting}
//                       // fileType="image"
//                       label="Select or upload a product image"
//                       // No need for onProgress here, as FileUpload handles its own display
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               className="w-full py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-md
//                          flex items-center justify-center"
//               style={{
//                 backgroundColor: "rgb(239, 167, 101)",
//                 color: "rgb(20, 31, 45)",
//               }}
//               disabled={isSubmitting} 
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin h-5 w-5 mr-3" /> Adding
//                   Product...
//                 </>
//               ) : (
//                 "Add Product"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }










// // src/app/admin/menu-management/page.tsx
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { Loader2, PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import axios from "axios";

// // Shadcn UI components
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// // Custom FileUpload component - Adjust path as needed
// import FileUpload from "@/components/MediaUploader";
// // Import schema and type from your file - Adjust path as needed
// import { menuSchema, MenuFormInputs } from "@/schemas/menuSchema";
// // Import the Mongoose interface for better typing - Adjust path as needed
// import { IMenu } from '@/models/Menu.model'; // Assuming IMenu is in this path

// // Define a client-side type for a menu item, extending IMenu with _id which Mongoose adds
// type MenuItem = IMenu & { _id: string };

// export default function MenuManagementPage() {
//   const { data: session, status } = useSession();
//   const [menus, setMenus] = useState<MenuItem[]>([]);
//   const [loadingMenus, setLoadingMenus] = useState(true);
//   const [isMenuFormDialogOpen, setIsMenuFormDialogOpen] = useState(false); // Controls the add/edit dialog
//   const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null); // State for editing

//   // State for Menu Deletion Confirmation Dialog
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [menuToDeleteId, setMenuToDeleteId] = useState<string | null>(null);
//   const [menuToDeleteCategory, setMenuToDeleteCategory] = useState<string | null>(null);

//   // React Hook Form for Menu Management (Add/Edit)
//   const menuForm = useForm<MenuFormInputs>({
//     resolver: zodResolver(menuSchema),
//     defaultValues: {
//       category: "",
//       p1name: "",
//       p1price: 0,
//       p2name: "",
//       p2price: 0,
//       p3name: "",
//       p3price: 0,
//       p4name: "",
//       p4price: 0,
//       imageSrc: "",
//     },
//   });

//   // --- Data Fetching ---
//   const fetchMenus = useCallback(async () => {
//     setLoadingMenus(true);
//     try {
//       const response = await axios.get("/api/menu");
//       if (response.data.success) {
//         setMenus(response.data.data);
//       } else {
//         throw new Error(response.data.message || "Failed to fetch menus.");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || error.message || "Failed to load menus.");
//       console.error("Error fetching menus:", error);
//     } finally {
//       setLoadingMenus(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.role === "admin") {
//       fetchMenus();
//     }
//   }, [status, session, fetchMenus]);

//   // --- Menu Management Handlers ---

//   const handleAddNewMenuClick = () => {
//     setEditingMenu(null); // Clear any editing state
//     menuForm.reset({ // Reset to default values for adding
//       category: "",
//       p1name: "",
//       p1price: 0,
//       p2name: "",
//       p2price: 0,
//       p3name: "",
//       p3price: 0,
//       p4name: "",
//       p4price: 0,
//       imageSrc: "",
//     });
//     // setIsMenuFormDialogOpen(true) is handled by DialogTrigger's onClick.
//     // If you remove `asChild` from DialogTrigger, you'd need to manually set it here.
//   };

//   const handleEditMenuClick = (menu: MenuItem) => {
//     setEditingMenu(menu);
//     // Populate form with menu data
//     menuForm.reset({
//       _id: menu._id, // Set the ID for update
//       category: menu.category,
//       p1name: menu.p1name,
//       p1price: menu.p1price,
//       p2name: menu.p2name,
//       p2price: menu.p2price,
//       p3name: menu.p3name,
//       p3price: menu.p3price,
//       p4name: menu.p4name,
//       p4price: menu.p4price,
//       imageSrc: menu.imageSrc,
//     });
//     setIsMenuFormDialogOpen(true); // Programmatically open dialog for editing
//   };

//   // Initiates menu deletion confirmation dialog
//   const confirmDeleteMenu = (menu: MenuItem) => {
//     setMenuToDeleteId(menu._id);
//     setMenuToDeleteCategory(menu.category);
//     setShowDeleteConfirm(true);
//   };

//   // Actual menu deletion logic, called after AlertDialog confirmation
//   const executeDeleteMenu = async () => {
//     if (!menuToDeleteId) return;
//     try {
//       const response = await axios.delete(`/api/menu/${menuToDeleteId}`);
//       if (response.data.success) {
//         toast.success(`Menu "${menuToDeleteCategory}" deleted successfully!`);
//         fetchMenus(); // Refresh the list
//       } else {
//         throw new Error(response.data.message || "Failed to delete menu.");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || error.message || "Failed to delete menu.");
//       console.error("Error deleting menu:", error);
//     } finally {
//       setMenuToDeleteId(null);
//       setMenuToDeleteCategory(null);
//       setShowDeleteConfirm(false);
//     }
//   };

//   const onMenuFormSubmit = async (data: MenuFormInputs) => {
//     // Manually setting submitting state as useForm's isSubmitting is sometimes delayed
//     // when using external state/async operations. Better practice: use form.formState.isSubmitting directly
//     // and rely on the resolver/handleSubmit. However, for clarity with existing state:
//     // menuForm.formState.isSubmitting = true; // This line is problematic if not managed carefully
//     // Better: let react-hook-form manage it, or use a separate local state if absolutely needed for complex flows.

//     // The form.formState.isSubmitting will be true automatically when handleSubmit is called
//     // and remains true until the promise returned by onSubmit resolves/rejects.

//     const url = editingMenu ? `/api/menu/${editingMenu._id}` : "/api/menu";
//     try {
//       const response = editingMenu
//         ? await axios.put(url, data)
//         : await axios.post(url, data);

//       if (response.data.success) {
//         toast.success(`Menu ${editingMenu ? "updated" : "added"} successfully!`);
//         setIsMenuFormDialogOpen(false); // Close on success
//         menuForm.reset(); // Reset form
//         fetchMenus(); // Refresh the list
//       } else {
//         throw new Error(response.data.message || `Failed to ${editingMenu ? "update" : "add"} menu.`);
//       }
//     } catch (error: any) {
//       console.error("Menu form submission error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || error.message || `Failed to ${editingMenu ? "update" : "add"} menu.`);
//     }
//     // No finally block for setIsSubmitting(false) if relying on form.formState.isSubmitting
//     // react-hook-form handles it automatically when the onSubmit promise settles.
//   };

//   // --- Authentication and Authorization Check ---
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-[#141f2d] flex items-center justify-center">
//         <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
//         <p className="text-white text-xl ml-4">Loading Admin Panel...</p>
//       </div>
//     );
//   }

//   if (status === "unauthenticated" || session?.user?.role !== "admin") {
//     // If you have a specific access denied page, redirect there.
//     // For now, redirect to sign-in page.
//     redirect("/auth/signin");
//     return null; // Ensure nothing is rendered while redirecting
//   }

//   return (
//     <div className="min-h-screen bg-[#141f2d] p-8 text-white">
//       <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl md:text-6xl font-bold text-center mb-12 drop-shadow-lg">
//         Admin Menu Management
//       </h1>

//       {/* Menu Management Section (Table and Add Button) */}
//       <section className="mb-12 bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765]">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold">Menu Categories</h2>

//           {/* Corrected Dialog structure: DialogTrigger must be inside a Dialog */}
//           <Dialog open={isMenuFormDialogOpen} onOpenChange={setIsMenuFormDialogOpen}>
//             <DialogTrigger asChild>
//               <Button onClick={handleAddNewMenuClick} className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90">
//                 <PlusCircle className="mr-2 h-5 w-5" /> Add New Menu
//               </Button>
//             </DialogTrigger>

//             {/* Dialog Content for Add/Edit Menu Form */}
//             <DialogContent
//               className="sm:max-w-[600px] md:max-w-[900px] bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white
//                          flex flex-col max-h-[90vh] overflow-y-auto"
//             >
//               <DialogHeader className="flex-shrink-0">
//                 <DialogTitle className="yeseva-one text-[rgb(239,167,101)]">
//                   {editingMenu ? `Edit Menu: ${editingMenu.category}` : "Add New Menu Category"}
//                 </DialogTitle>
//                 <DialogDescription className="text-gray-400">
//                   {editingMenu ? "Make changes to this menu category and its products." : "Add a new menu category with its four main products."}
//                 </DialogDescription>
//               </DialogHeader>

//               {/* Form for Menu Details */}
//               <Form {...menuForm}>
//                 <form onSubmit={menuForm.handleSubmit(onMenuFormSubmit)} className="flex flex-col flex-grow">
//                   <div className="flex-grow overflow-y-auto pr-4 -mr-4 scrollbar-hide py-4 space-y-6">
//                     {/* Category and Image */}
//                     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//                       <FormField
//                         control={menuForm.control}
//                         name="category"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Category Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Burgers" {...field} className="bg-gray-700 text-white border-gray-600" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={menuForm.control}
//                         name="imageSrc"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Category Image</FormLabel>
//                             <FormControl>
//                               <FileUpload
//                                 onChange={field.onChange}
//                                 value={field.value}
//                                 name={field.name}
//                                 disabled={menuForm.formState.isSubmitting}
//                                 label="Upload category image"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Product 1 */}
//                     <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 1 Details</h3>
//                     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//                       <FormField
//                         control={menuForm.control}
//                         name="p1name"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Classic Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={menuForm.control}
//                         name="p1price"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 placeholder="750.00"
//                                 {...field}
//                                 onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
//                                 className="bg-gray-700 text-white border-gray-600"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Product 2 */}
//                     <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 2 Details</h3>
//                     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//                       <FormField
//                         control={menuForm.control}
//                         name="p2name"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Zinger Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={menuForm.control}
//                         name="p2price"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 placeholder="600.00"
//                                 {...field}
//                                 onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
//                                 className="bg-gray-700 text-white border-gray-600"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Product 3 */}
//                     <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 3 Details</h3>
//                     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//                       <FormField
//                         control={menuForm.control}
//                         name="p3name"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Veggie Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={menuForm.control}
//                         name="p3price"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 placeholder="550.00"
//                                 {...field}
//                                 onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
//                                 className="bg-gray-700 text-white border-gray-600"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Product 4 */}
//                     <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 4 Details</h3>
//                     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//                       <FormField
//                         control={menuForm.control}
//                         name="p4name"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Swiss Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={menuForm.control}
//                         name="p4price"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 placeholder="800.00"
//                                 {...field}
//                                 onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
//                                 className="bg-gray-700 text-white border-gray-600"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div> {/* End of overflow-y-auto div */}

//                   <DialogFooter className="flex-shrink-0 pt-4">
//                     <Button type="submit" disabled={menuForm.formState.isSubmitting} className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90">
//                       {menuForm.formState.isSubmitting ? (
//                         <>
//                           <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
//                         </>
//                       ) : (
//                         editingMenu ? "Save Changes" : "Add Menu"
//                       )}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </Form>
//             </DialogContent>
//           </Dialog> {/* End of the Dialog for Add/Edit */}

//         </div> {/* End of flex justify-between items-center mb-6 div */}

//         {/* Table to display existing menus */}
//         {loadingMenus ? (
//           <div className="flex items-center justify-center py-8">
//             <Loader2 className="animate-spin h-8 w-8 text-[#efa765]" />
//             <p className="ml-3 text-lg">Loading menus...</p>
//           </div>
//         ) : menus.length === 0 ? (
//           <p className="text-center text-gray-400 py-8">No menus found. Add one to get started!</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-800 hover:bg-gray-800">
//                   <TableHead className="text-[#efa765]">Image</TableHead>
//                   <TableHead className="text-[#efa765]">Category</TableHead>
//                   <TableHead className="text-[#efa765]">Product 1</TableHead>
//                   <TableHead className="text-[#efa765]">Product 2</TableHead>
//                   <TableHead className="text-[#efa765]">Product 3</TableHead>
//                   <TableHead className="text-[#efa765]">Product 4</TableHead>
//                   <TableHead className="text-[#efa765] text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {menus.map((menu) => (
//                   <TableRow key={menu._id} className="border-gray-700 hover:bg-gray-700">
//                     <TableCell>
//                       <Image
//                         src={menu.imageSrc}
//                         alt={menu.category}
//                         width={80}
//                         height={80}
//                         className="rounded-md object-cover"
//                       />
//                     </TableCell>
//                     <TableCell className="font-medium text-white">{menu.category}</TableCell>
//                     <TableCell className="text-gray-300">
//                       {menu.p1name} (PKR {menu.p1price.toLocaleString()})
//                     </TableCell>
//                     <TableCell className="text-gray-300">
//                       {menu.p2name} (PKR {menu.p2price.toLocaleString()})
//                     </TableCell>
//                     <TableCell className="text-gray-300">
//                       {menu.p3name} (PKR {menu.p3price.toLocaleString()})
//                     </TableCell>
//                     <TableCell className="text-gray-300">
//                       {menu.p4name} (PKR {menu.p4price.toLocaleString()})
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-gray-600">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem
//                             onClick={() => handleEditMenuClick(menu)}
//                             className="text-gray-200 hover:bg-gray-700 cursor-pointer"
//                           >
//                             <Edit className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator className="bg-gray-700" />
//                           <DropdownMenuItem
//                             onClick={() => confirmDeleteMenu(menu)}
//                             className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </section>

//       {/* Menu Delete Confirmation Dialog (This remains separate as it's a different type of dialog) */}
//       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <AlertDialogContent className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="yeseva-one text-red-500">Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription className="text-gray-400">
//               This action cannot be undone. This will permanently delete the menu category:
//               <br /><span className="font-bold text-white text-lg">{menuToDeleteCategory}</span>.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={executeDeleteMenu} className="bg-red-600 text-white hover:bg-red-700">
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }








// src/app/admin/menu-management/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";

// Shadcn UI components
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
// Removed Table imports, as we're no longer using them
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Custom FileUpload component - Adjust path as needed
import FileUpload from "@/components/MediaUploader";
// Import schema and type from your file - Adjust path as needed
import { menuSchema, MenuFormInputs } from "@/schemas/menuSchema";
// Import the Mongoose interface for better typing - Adjust path as needed
import { IMenu } from '@/models/Menu.model'; // Assuming IMenu is in this path

// Define a client-side type for a menu item, extending IMenu with _id which Mongoose adds
type MenuItem = IMenu & { _id: string };

export default function MenuManagementPage() {
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [isMenuFormDialogOpen, setIsMenuFormDialogOpen] = useState(false); // Controls the add/edit dialog
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null); // State for editing

  // State for Menu Deletion Confirmation Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuToDeleteId, setMenuToDeleteId] = useState<string | null>(null);
  const [menuToDeleteCategory, setMenuToDeleteCategory] = useState<string | null>(null);

  // React Hook Form for Menu Management (Add/Edit)
  const menuForm = useForm<MenuFormInputs>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      category: "",
      p1name: "",
      p1price: 0,
      p2name: "",
      p2price: 0,
      p3name: "",
      p3price: 0,
      p4name: "",
      p4price: 0,
      imageSrc: "",
    },
  });

  // --- Data Fetching ---
  const fetchMenus = useCallback(async () => {
    setLoadingMenus(true);
    try {
      const response = await axios.get("/api/menu");
      if (response.data.success) {
        setMenus(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch menus.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to load menus.");
      console.error("Error fetching menus:", error);
    } finally {
      setLoadingMenus(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchMenus();
    }
  }, [status, session, fetchMenus]);

  // --- Menu Management Handlers ---

  const handleAddNewMenuClick = () => {
    setEditingMenu(null); // Clear any editing state
    menuForm.reset({ // Reset to default values for adding
      category: "",
      p1name: "",
      p1price: 0,
      p2name: "",
      p2price: 0,
      p3name: "",
      p3price: 0,
      p4name: "",
      p4price: 0,
      imageSrc: "",
    });
    // setIsMenuFormDialogOpen(true) is handled by DialogTrigger's onClick.
    // If you remove `asChild` from DialogTrigger, you'd need to manually set it here.
  };

  const handleEditMenuClick = (menu: MenuItem) => {
    setEditingMenu(menu);
    // Populate form with menu data
    menuForm.reset({
      _id: menu._id, // Set the ID for update
      category: menu.category,
      p1name: menu.p1name,
      p1price: menu.p1price,
      p2name: menu.p2name,
      p2price: menu.p2price,
      p3name: menu.p3name,
      p3price: menu.p3price,
      p4name: menu.p4name,
      p4price: menu.p4price,
      imageSrc: menu.imageSrc,
    });
    setIsMenuFormDialogOpen(true); // Programmatically open dialog for editing
  };

  // Initiates menu deletion confirmation dialog
  const confirmDeleteMenu = (menu: MenuItem) => {
    setMenuToDeleteId(menu._id);
    setMenuToDeleteCategory(menu.category);
    setShowDeleteConfirm(true);
  };

  // Actual menu deletion logic, called after AlertDialog confirmation
  const executeDeleteMenu = async () => {
    if (!menuToDeleteId) return;
    try {
      const response = await axios.delete(`/api/menu/${menuToDeleteId}`);
      if (response.data.success) {
        toast.success(`Menu "${menuToDeleteCategory}" deleted successfully!`);
        fetchMenus(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to delete menu.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete menu.");
      console.error("Error deleting menu:", error);
    } finally {
      setMenuToDeleteId(null);
      setMenuToDeleteCategory(null);
      setShowDeleteConfirm(false);
    }
  };

  const onMenuFormSubmit = async (data: MenuFormInputs) => {
    const url = editingMenu ? `/api/menu/${editingMenu._id}` : "/api/menu";
    try {
      const response = editingMenu
        ? await axios.put(url, data)
        : await axios.post(url, data);

      if (response.data.success) {
        toast.success(`Menu ${editingMenu ? "updated" : "added"} successfully!`);
        setIsMenuFormDialogOpen(false); // Close on success
        menuForm.reset(); // Reset form
        fetchMenus(); // Refresh the list
      } else {
        throw new Error(response.data.message || `Failed to ${editingMenu ? "update" : "add"} menu.`);
      }
    } catch (error: any) {
      console.error("Menu form submission error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || `Failed to ${editingMenu ? "update" : "add"} menu.`);
    }
  };

  // --- Authentication and Authorization Check ---
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#141f2d] flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
        <p className="text-white text-xl ml-4">Loading Admin Panel...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    redirect("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#141f2d] p-8 text-white">
      <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl md:text-6xl font-bold text-center mb-12 drop-shadow-lg">
        Menu Management
      </h1>

      <section className="mb-12 bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold">Menu Categories</h2>

          <Dialog open={isMenuFormDialogOpen} onOpenChange={setIsMenuFormDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNewMenuClick} className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Menu
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-[600px] md:max-w-[900px] bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white
                         flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="yeseva-one text-[rgb(239,167,101)]">
                  {editingMenu ? `Edit Menu: ${editingMenu.category}` : "Add New Menu Category"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingMenu ? "Make changes to this menu category and its products." : "Add a new menu category with its four main products."}
                </DialogDescription>
              </DialogHeader>

              <Form {...menuForm}>
                <form onSubmit={menuForm.handleSubmit(onMenuFormSubmit)} className="flex flex-col flex-grow">
                  <div className="flex-grow overflow-y-auto pr-4 -mr-4 scrollbar-hide py-4 space-y-6">
                    {/* Category and Image */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <FormField
                        control={menuForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Burgers" {...field} className="bg-gray-700 text-white border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={menuForm.control}
                        name="imageSrc"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Category Image</FormLabel>
                            <FormControl>
                              <FileUpload
                                onChange={field.onChange}
                                value={field.value}
                                name={field.name}
                                disabled={menuForm.formState.isSubmitting}
                                label="Upload category image"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Product 1 */}
                    <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 1 Details</h3>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <FormField
                        control={menuForm.control}
                        name="p1name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Classic Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={menuForm.control}
                        name="p1price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="750.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Product 2 */}
                    <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 2 Details</h3>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <FormField
                        control={menuForm.control}
                        name="p2name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Zinger Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={menuForm.control}
                        name="p2price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="600.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Product 3 */}
                    <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 3 Details</h3>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <FormField
                        control={menuForm.control}
                        name="p3name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Veggie Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={menuForm.control}
                        name="p3price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="550.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Product 4 */}
                    <h3 className="text-[#efa765] text-xl font-bold mt-6 mb-2">Product 4 Details</h3>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <FormField
                        control={menuForm.control}
                        name="p4name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Swiss Burger" {...field} className="bg-gray-700 text-white border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={menuForm.control}
                        name="p4price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="800.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div> {/* End of overflow-y-auto div */}

                  <DialogFooter className="flex-shrink-0 pt-4">
                    <Button type="submit" disabled={menuForm.formState.isSubmitting} className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90">
                      {menuForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
                        </>
                      ) : (
                        editingMenu ? "Save Changes" : "Add Menu"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog> {/* End of the Dialog for Add/Edit */}

        </div> {/* End of flex justify-between items-center mb-6 div */}

        {/* Display existing menus as cards */}
        {loadingMenus ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-[#efa765]" />
            <p className="ml-3 text-lg">Loading menus...</p>
          </div>
        ) : menus.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No menus found. Add one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu._id} className="relative bg-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600">
                {/* Image Section */}
                <div className="relative w-full h-48">
                  <Image
                    src={menu.imageSrc || '/placeholder-image.jpg'} // Fallback placeholder
                    alt={menu.category}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-2xl font-bold mb-2 text-[#efa765] truncate">{menu.category}</h3>
                  <div className="space-y-1 text-gray-200 text-sm">
                    <p><span className="font-semibold">{menu.p1name}</span>: PKR {menu.p1price.toLocaleString()}</p>
                    <p><span className="font-semibold">{menu.p2name}</span>: PKR {menu.p2price.toLocaleString()}</p>
                    <p><span className="font-semibold">{menu.p3name}</span>: PKR {menu.p3price.toLocaleString()}</p>
                    <p><span className="font-semibold">{menu.p4name}</span>: PKR {menu.p4price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-gray-600">
                        <span className="sr-only">Open menu actions</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleEditMenuClick(menu)}
                        className="text-gray-200 hover:bg-gray-700 cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem
                        onClick={() => confirmDeleteMenu(menu)}
                        className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Menu Delete Confirmation Dialog (This remains separate as it's a different type of dialog) */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="yeseva-one text-red-500">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the menu category:
              <br /><span className="font-bold text-white text-lg">{menuToDeleteCategory}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteMenu} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}