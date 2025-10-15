// "use client";

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';
// import { z } from 'zod';

// // Define the Zod schema for the form data
// const couponSchema = z.object({
//   code: z.string().min(1, { message: 'Coupon code is required.' }).trim(),
//   type: z.enum(['fixed', 'percent'], { message: 'Coupon type is required.' }),
//   value: z.coerce.number().min(0, { message: 'Value must be a positive number.' }),
//   expiryDate: z.string().optional(),
// });

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     code: '',
//     type: 'fixed',
//     value: '',
//     expiryDate: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e:any) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (value: any) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       type: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Validate data with Zod before sending
//       const validatedData = couponSchema.parse(formData);
      
//       const response = await fetch('/api/coupon/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(validatedData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success(result.message);
//         setFormData({
//           code: '',
//           type: 'fixed',
//           value: '',
//           expiryDate: '',
//         });
//       } else {
//         toast.error(result.message || 'Failed to create coupon.');
//       }
//     } catch (error:any) {
//       if (error instanceof z.ZodError) {
//         // Handle Zod validation errors
//         error.errors.forEach(err => toast.error(err.message));
//       } else {
//         toast.error('An unexpected error occurred.');
//         console.error('Submission error:', error);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen bg-[#141F2D]">
//       <Card className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-[#1D2B3F] text-[#EFA765]">
//         <h2 className="text-3xl font-bold mb-6 text-center yeseva-one">Create New Coupon</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="code" className="text-md">Coupon Code</Label>
//             <Input
//               id="code"
//               name="code"
//               type="text"
//               placeholder="e.g., BLACKFRIDAY20"
//               value={formData.code}
//               onChange={handleChange}
//               className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="type" className="text-md">Discount Type</Label>
//             <Select onValueChange={handleSelectChange} value={formData.type}>
//               <SelectTrigger className="bg-white/10 border-[#EFA765]/50 text-white rounded-md">
//                 <SelectValue placeholder="Select a type" />
//               </SelectTrigger>
//               <SelectContent className="bg-[#1D2B3F] text-[#EFA765]">
//                 <SelectItem value="fixed">Fixed Amount</SelectItem>
//                 <SelectItem value="percent">Percentage</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="value" className="text-md">Value</Label>
//             <Input
//               id="value"
//               name="value"
//               type="number"
//               placeholder={formData.type === 'fixed' ? 'e.g., 20' : 'e.g., 0.1 for 10%'}
//               value={formData.value}
//               onChange={handleChange}
//               className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="expiryDate" className="text-md font-[Yeseve One]">Expiry Date (Optional)</Label>
//             <Input
//               id="expiryDate"
//               name="expiryDate"
//               type="date"
//               value={formData.expiryDate}
//               onChange={handleChange}
//               className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//             />
//           </div>
//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full font-bold text-lg"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               'Create Coupon'
//             )}
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default AdminPage;





// "use client";

// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { Loader2, Pencil, Trash2 } from 'lucide-react';
// import { z } from 'zod';

// // Define the Zod schema for the form data
// const couponSchema = z.object({
//   code: z.string().min(1, { message: 'Coupon code is required.' }).trim(),
//   type: z.enum(['fixed', 'percent'], { message: 'Coupon type is required.' }),
//   value: z.coerce.number().min(0, { message: 'Value must be a positive number.' }),
//   expiryDate: z.string().optional(),
// });

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     code: '',
//     type: 'fixed',
//     value: '',
//     expiryDate: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [coupons, setCoupons] = useState([]);
//   const [isCouponsLoading, setIsCouponsLoading] = useState(true);
//   const [editingCoupon, setEditingCoupon] = useState(null);

//   // Function to fetch coupons from the database
//   const fetchCoupons = async () => {
//     setIsCouponsLoading(true);
//     try {
//       const response = await fetch('/api/coupon/all');
//       if (response.ok) {
//         const data = await response.json();
//         setCoupons(data.coupons);
//       } else {
//         toast.error('Failed to fetch coupons.');
//       }
//     } catch (error) {
//       console.error("Error fetching coupons:", error);
//       toast.error('An error occurred while fetching coupons.');
//     } finally {
//       setIsCouponsLoading(false);
//     }
//   };

//   // Fetch coupons on component mount
//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       type: value,
//     }));
//   };

//   const handleEditClick = (coupon) => {
//     setEditingCoupon(coupon);
//     setFormData({
//       code: coupon.code,
//       type: coupon.type,
//       value: coupon.value,
//       expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '', // Format date for input
//     });
//   };

//   const handleDeleteClick = async (couponId) => {
//     if (!window.confirm("Are you sure you want to delete this coupon?")) {
//       return;
//     }

//     try {
//       const response = await fetch('/api/coupon/delete', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id: couponId }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         toast.success(result.message);
//         fetchCoupons(); // Refresh the list
//       } else {
//         toast.error(result.message || 'Failed to delete coupon.');
//       }
//     } catch (error) {
//       console.error("Error deleting coupon:", error);
//       toast.error('An error occurred while deleting the coupon.');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingCoupon(null);
//     setFormData({
//       code: '',
//       type: 'fixed',
//       value: '',
//       expiryDate: '',
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const validatedData = couponSchema.parse(formData);
      
//       let response;
//       let result;

//       if (editingCoupon) {
//         // Update existing coupon
//         response = await fetch('/api/coupon/update', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ id: editingCoupon._id, ...validatedData }),
//         });
//         result = await response.json();
//       } else {
//         // Create new coupon
//         response = await fetch('/api/coupon/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(validatedData),
//         });
//         result = await response.json();
//       }

//       if (response.ok) {
//         toast.success(result.message);
//         handleCancelEdit(); // Reset form and editing state
//         fetchCoupons(); // Refresh the list of coupons
//       } else {
//         toast.error(result.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon.`);
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         error.errors.forEach(err => toast.error(err.message));
//       } else {
//         toast.error('An unexpected error occurred.');
//         console.error('Submission error:', error);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isCouponActive = (expiryDate) => {
//     if (!expiryDate) return true;
//     return new Date(expiryDate) > new Date();
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-[#141F2D]">
//       <div className="flex items-center justify-center">
//         <Card className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-[#1D2B3F] text-[#EFA765]">
//           <h2 className="text-3xl font-bold mb-6 text-center font-[Yeseve One]">
//             {editingCoupon ? 'Update Coupon' : 'Create New Coupon'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="code" className="text-md font-[Yeseve One]">Coupon Code</Label>
//               <Input
//                 id="code"
//                 name="code"
//                 type="text"
//                 placeholder="e.g., BLACKFRIDAY20"
//                 value={formData.code}
//                 onChange={handleChange}
//                 className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="type" className="text-md font-[Yeseve One]">Discount Type</Label>
//               <Select onValueChange={handleSelectChange} value={formData.type}>
//                 <SelectTrigger className="bg-white/10 border-[#EFA765]/50 text-white rounded-md">
//                   <SelectValue placeholder="Select a type" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#1D2B3F] text-[#EFA765]">
//                   <SelectItem value="fixed">Fixed Amount</SelectItem>
//                   <SelectItem value="percent">Percentage</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="value" className="text-md font-[Yeseve One]">Value</Label>
//               <Input
//                 id="value"
//                 name="value"
//                 type="number"
//                 placeholder={formData.type === 'fixed' ? 'e.g., 20' : 'e.g., 0.1 for 10%'}
//                 value={formData.value}
//                 onChange={handleChange}
//                 className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="expiryDate" className="text-md font-[Yeseve One]">Expiry Date (Optional)</Label>
//               <Input
//                 id="expiryDate"
//                 name="expiryDate"
//                 type="date"
//                 value={formData.expiryDate}
//                 onChange={handleChange}
//                 className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full font-bold text-lg"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {editingCoupon ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   editingCoupon ? 'Update Coupon' : 'Create Coupon'
//                 )}
//               </Button>
//               {editingCoupon && (
//                 <Button
//                   type="button"
//                   onClick={handleCancelEdit}
//                   className="w-full bg-transparent border border-[#EFA765] text-[#EFA765] hover:bg-white/10 transition-colors duration-300 rounded-full font-bold text-lg"
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Card>
//       </div>

//       <div className="flex items-center justify-center">
//         <Card className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-[#1D2B3F] text-[#EFA765]">
//           <h2 className="text-3xl font-bold mb-6 text-center font-[Yeseve One]">Existing Coupons</h2>
//           {isCouponsLoading ? (
//             <div className="flex justify-center items-center py-8 text-white">
//               <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading coupons...
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {coupons.length === 0 ? (
//                 <p className="text-center text-white/50">No coupons found.</p>
//               ) : (
//                 coupons.map((coupon) => (
//                   <div key={coupon._id} className="p-4 border border-[#EFA765]/20 rounded-lg flex justify-between items-center text-white bg-white/5">
//                     <div>
//                       <h3 className="text-lg font-bold font-[Yeseve One]">{coupon.code}</h3>
//                       <p className="text-sm">
//                         Type: {coupon.type === 'fixed' ? 'Fixed' : 'Percentage'}
//                       </p>
//                       <p className="text-sm">
//                         Value: {coupon.type === 'fixed' ? `PKR ${coupon.value}` : `${coupon.value * 100}%`}
//                       </p>
//                       {coupon.expiryDate && (
//                         <p className="text-sm text-white/70">
//                           Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`font-semibold px-3 py-1 rounded-full text-xs ${
//                           isCouponActive(coupon.expiryDate)
//                             ? 'bg-green-600 text-white'
//                             : 'bg-red-600 text-white'
//                         }`}
//                       >
//                         {isCouponActive(coupon.expiryDate) ? 'Active' : 'Inactive'}
//                       </span>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={() => handleEditClick(coupon)}
//                         className="text-[#EFA765] hover:bg-white/10"
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={() => handleDeleteClick(coupon._id)}
//                         className="text-red-500 hover:bg-white/10"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;





"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the Zod schema for the form data
const couponSchema = z.object({
  code: z.string().min(1, { message: 'Coupon code is required.' }).trim(),
  type: z.enum(['fixed', 'percent'], { message: 'Coupon type is required.' }),
  value: z.coerce.number().min(0, { message: 'Value must be a positive number.' }),
  expiryDate: z.string().optional(),
});

const AdminPage = () => {
  const [formData, setFormData] = useState({
    code: '',
    type: 'fixed',
    value: '',
    expiryDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [couponToDeleteId, setCouponToDeleteId] = useState(null);

  // Function to fetch coupons from the database
  const fetchCoupons = async () => {
    setIsCouponsLoading(true);
    try {
      const response = await fetch('/api/coupon/all');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      } else {
        toast.error('Failed to fetch coupons.');
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error('An error occurred while fetching coupons.');
    } finally {
      setIsCouponsLoading(false);
    }
  };

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      type: value,
    }));
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '', // Format date for input
    });
  };

  const handleDeleteClick = (couponId) => {
    setCouponToDeleteId(couponId);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch('/api/coupon/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: couponToDeleteId }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchCoupons(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to delete coupon.');
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error('An error occurred while deleting the coupon.');
    } finally {
      setShowDeleteAlert(false);
      setCouponToDeleteId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'fixed',
      value: '',
      expiryDate: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = couponSchema.parse(formData);
      
      let response;
      let result;

      if (editingCoupon) {
        // Update existing coupon
        response = await fetch('/api/coupon/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingCoupon._id, ...validatedData }),
        });
        result = await response.json();
      } else {
        // Create new coupon
        response = await fetch('/api/coupon/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        });
        result = await response.json();
      }

      if (response.ok) {
        toast.success(result.message);
        handleCancelEdit(); // Reset form and editing state
        fetchCoupons(); // Refresh the list of coupons
      } else {
        toast.error(result.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon.`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error('An unexpected error occurred.');
        console.error('Submission error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isCouponActive = (expiryDate) => {
    if (!expiryDate) return true;
    return new Date(expiryDate) > new Date();
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-[#141F2D]">
      <div className="flex items-center justify-center">
        <Card className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-[#1D2B3F] text-[#EFA765]">
          <h2 className="text-3xl font-bold mb-6 text-center font-[Yeseve One]">
            {editingCoupon ? 'Update Coupon' : 'Create New Coupon'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-md font-[Yeseve One]">Coupon Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="e.g., BLACKFRIDAY20"
                value={formData.code}
                onChange={handleChange}
                className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-md font-[Yeseve One]">Discount Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.type}>
                <SelectTrigger className="bg-white/10 border-[#EFA765]/50 text-white rounded-md">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1D2B3F] text-[#EFA765]">
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percent">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value" className="text-md font-[Yeseve One]">Value</Label>
              <Input
                id="value"
                name="value"
                type="number"
                placeholder={formData.type === 'fixed' ? 'e.g., 20' : 'e.g., 0.1 for 10%'}
                value={formData.value}
                onChange={handleChange}
                className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-md font-[Yeseve One]">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="bg-white/10 border-[#EFA765]/50 text-white rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full font-bold text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingCoupon ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingCoupon ? 'Update Coupon' : 'Create Coupon'
                )}
              </Button>
              {editingCoupon && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-transparent border border-[#EFA765] text-[#EFA765] hover:bg-white/10 transition-colors duration-300 rounded-full font-bold text-lg"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Card className="p-6 rounded-xl shadow-lg w-full max-w-lg bg-[#1D2B3F] text-[#EFA765]">
          <h2 className="text-3xl font-bold mb-6 text-center font-[Yeseve One]">Existing Coupons</h2>
          {isCouponsLoading ? (
            <div className="flex justify-center items-center py-8 text-white">
              <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading coupons...
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.length === 0 ? (
                <p className="text-center text-white/50">No coupons found.</p>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon._id} className="p-4 border border-[#EFA765]/20 rounded-lg flex justify-between items-center text-white bg-white/5">
                    <div>
                      <h3 className="text-lg font-bold font-[Yeseve One]">{coupon.code}</h3>
                      <p className="text-sm">
                        Type: {coupon.type === 'fixed' ? 'Fixed' : 'Percentage'}
                      </p>
                      <p className="text-sm">
                        Value: {coupon.type === 'fixed' ? `PKR ${coupon.value}` : `${coupon.value * 100}%`}
                      </p>
                      {coupon.expiryDate && (
                        <p className="text-sm text-white/70">
                          Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-xs ${
                          isCouponActive(coupon.expiryDate)
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {isCouponActive(coupon.expiryDate) ? 'Active' : 'Inactive'}
                      </span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEditClick(coupon)}
                        className="text-[#EFA765] hover:bg-white/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeleteClick(coupon._id)}
                            className="text-red-500 hover:bg-white/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1D2B3F] text-[#EFA765]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/70">
                              This action cannot be undone. This will permanently delete the 
                              <span className="font-bold text-[#EFA765]"> {coupon.code} </span> coupon.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
