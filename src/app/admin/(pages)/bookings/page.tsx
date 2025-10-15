// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import axios, { AxiosError } from 'axios';
// import { toast } from 'sonner';
// import { Loader2, CalendarCheck, CalendarX, Trash2, Users } from 'lucide-react';
// import { format } from 'date-fns';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { IBooking } from '@/models/Booking.model';

// // Type for API response errors
// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// export default function AdminBookingsPage() {
//   const [bookings, setBookings] = useState<IBooking[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

//   const fetchBookings = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get('/api/bookingTable');
//       setBookings(response.data.bookings || []);
//     } catch (error) {
//       console.error('Failed to fetch bookings:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to fetch bookings.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   const handleToggleConfirmation = async (bookingId: string, currentStatus: boolean) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.patch(`/api/bookingTable/${bookingId}`, {
//         isConfirmed: !currentStatus,
//       });
//       toast.success(response.data.message);
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking._id === bookingId ? { ...booking, isConfirmed: !currentStatus } as IBooking : booking
//         )
//       );
//     } catch (error) {
//       console.error('Failed to update booking status:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to update booking status.');
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleDeleteBooking = async (bookingId: string) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.delete(`/api/bookingTable/${bookingId}`);
//       toast.success(response.data.message);
//       setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
//     } catch (error) {
//       console.error('Failed to delete booking:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to delete booking.');
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleBookingClick = (booking: IBooking) => {
//     setSelectedBooking(booking);
//     setIsBookingDialogOpen(true);
//   };

//   return (
//     <>
//       <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
//         <div className="mb-6">
//           <h1
//             className="yeseva-one text-4xl font-bold mb-2 tracking-wide"
//             style={{ color: 'rgb(239, 167, 101)' }}
//           >
//             Booked Tables Management
//           </h1>
//           <p className="text-gray-400">
//             Oversee all table reservations. Confirm, mark as pending, or cancel bookings.
//           </p>
//         </div>
//         <div className="rounded-md border border-[#efa765] bg-[#141f2d] text-white overflow-hidden">
//           <div className="h-[400px] overflow-y-auto">
//             <Table>
//               <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765]">
//                 <TableRow>
//                   <TableHead className="w-[150px] text-[#efa765] font-bold">Customer</TableHead>
//                   <TableHead className="w-[200px] text-[#efa765] font-bold">Email</TableHead>
//                   <TableHead className="text-[#efa765] font-bold">Date</TableHead>
//                   <TableHead className="text-[#efa765] font-bold">Time</TableHead>
//                   <TableHead className="text-center text-[#efa765] font-bold">Guests</TableHead>
//                   <TableHead className="w-[120px] text-center text-[#efa765] font-bold">Status</TableHead>
//                   <TableHead className="w-[150px] text-center text-[#efa765] font-bold">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
//                         <span className="ml-4 text-xl text-[#efa765]">Loading bookings...</span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : bookings.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10 text-gray-400">
//                       No table bookings found yet.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   bookings.map((booking) => (
//                     <TableRow key={booking._id} className="border-gray-700 hover:bg-[#1c2a3b] cursor-pointer" onClick={() => handleBookingClick(booking)}>
//                       <TableCell className="font-medium text-white">{booking.name}</TableCell>
//                       <TableCell className="text-gray-300">{booking.email}</TableCell>
//                       <TableCell className="text-gray-400">
//                         {format(new Date(booking.date + 'T00:00:00'), 'MMM dd, yyyy')}
//                       </TableCell>
//                       <TableCell className="text-gray-400">{booking.time}</TableCell>
//                       <TableCell className="text-center text-gray-400">
//                         <div className="flex justify-center items-center">
//                           {booking.guests} <Users className="h-4 w-4 ml-1" />
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Badge variant={booking.isConfirmed ? 'default' : 'secondary'} className="px-3 py-1 text-sm">
//                           {booking.isConfirmed ? 'Confirmed' : 'Pending'}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center space-x-2">
//                           <Button
//                             variant={booking.isConfirmed ? 'destructive' : 'default'}
//                             size="icon"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleToggleConfirmation(booking._id, booking.isConfirmed);
//                             }}
//                             disabled={isActionLoading}
//                             className="h-8 w-8"
//                             style={{ backgroundColor: booking.isConfirmed ? '#dc2626' : '#22c55e' }}
//                           >
//                             {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
//                               booking.isConfirmed ? <CalendarX className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />
//                             )}
//                             <span className="sr-only">{booking.isConfirmed ? 'Mark as Pending' : 'Confirm Booking'}</span>
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 disabled={isActionLoading}
//                                 onClick={(e) => e.stopPropagation()}
//                                 className="h-8 w-8 text-red-500 hover:bg-red-500/10"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 <span className="sr-only">Delete</span>
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
//                                 <AlertDialogDescription className="text-gray-300">
//                                   This action cannot be undone. This will permanently delete the booking from your database.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleDeleteBooking(booking._id)}
//                                   className="bg-red-600 text-white hover:bg-red-700"
//                                 >
//                                   {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-[#efa765]">
//           <DialogHeader>
//             <DialogTitle className="text-[#efa765] text-2xl font-bold">
//               Booking for {selectedBooking?.name}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="text-gray-400">
//             <div className="mb-2">
//               <span className="font-bold text-gray-300">Email:</span> {selectedBooking?.email}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold text-gray-300">Phone:</span> {selectedBooking?.phone}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold text-gray-300">Date:</span>{' '}
//               {selectedBooking?.date ? format(new Date(selectedBooking.date + 'T00:00:00'), 'MMM dd, yyyy') : 'N/A'}
//             </div>
//             <div className="mb-2">
//               <span className="font-bold text-gray-300">Time:</span> {selectedBooking?.time}
//             </div>
//             <div className="mb-4">
//               <span className="font-bold text-gray-300">Guests:</span> {selectedBooking?.guests}
//             </div>
//           </div>
//           <div className="bg-gray-800 p-4 rounded-md h-64 overflow-y-auto text-gray-200">
//             <span className="font-bold text-gray-300">Special Requests:</span>
//             <p className='mt-2'>
//               {selectedBooking?.requests || "No special requests."}
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }









// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';
// import axios, { AxiosError } from 'axios';
// import { toast } from 'sonner';
// import {
//   Loader2,
//   CalendarCheck,
//   CalendarX,
//   Trash2,
//   Users,
//   Search,
//   CheckCircle,
//   Clock,
//   LayoutDashboard,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

// interface IBooking {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   date: string; // YYYY-MM-DD
//   time: string; // HH:MM
//   guests: number;
//   isConfirmed: boolean;
//   requests?: string;
//   // Add other required fields if necessary
// }

// // Type for API response errors
// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// export default function AdminBookingsPage() {
//   const [bookings, setBookings] = useState<IBooking[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

//   // --- NEW STATE FOR DETAILS/CONTROLS ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending'>('all');
//   // ---------------------------------------

//   const fetchBookings = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       // NOTE: This is the actual API call, no mock data is used here.
//       const response = await axios.get('/api/bookingTable');
//       setBookings(response.data.bookings || []);
//     } catch (error) {
//       console.error('Failed to fetch bookings:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to fetch bookings.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   // --- DERIVED STATE (STATS) ---
//   const totalBookings = bookings.length;
//   const confirmedBookingsCount = bookings.filter(b => b.isConfirmed).length;
//   const pendingBookingsCount = totalBookings - confirmedBookingsCount;
//   const percentageConfirmed = totalBookings > 0 ? ((confirmedBookingsCount / totalBookings) * 100).toFixed(0) : 0;
//   // -----------------------------

//   // --- FILTERING LOGIC ---
//   const filteredBookings = useMemo(() => {
//     let currentBookings = bookings;

//     // 1. Filter by Status
//     if (filterStatus === 'confirmed') {
//       currentBookings = currentBookings.filter(b => b.isConfirmed);
//     } else if (filterStatus === 'pending') {
//       currentBookings = currentBookings.filter(b => !b.isConfirmed);
//     }

//     // 2. Filter by Search Term (Name or Email)
//     if (searchTerm) {
//       const lowerCaseSearch = searchTerm.toLowerCase();
//       currentBookings = currentBookings.filter(
//         b => b.name.toLowerCase().includes(lowerCaseSearch) || b.email.toLowerCase().includes(lowerCaseSearch)
//       );
//     }

//     // NOTE: Sorting is typically done here if required, but we omit orderBy for Firestore safety.
//     // Sorting by date (newest first)
//     return currentBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [bookings, filterStatus, searchTerm]);
//   // -----------------------

//   const handleToggleConfirmation = async (bookingId: string, currentStatus: boolean) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.patch(`/api/bookingTable/${bookingId}`, {
//         isConfirmed: !currentStatus,
//       });
//       toast.success(response.data.message);
//       // Update local state without refetching
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking._id === bookingId ? { ...booking, isConfirmed: !currentStatus } as IBooking : booking
//         )
//       );
//     } catch (error) {
//       console.error('Failed to update booking status:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to update booking status.');
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleDeleteBooking = async (bookingId: string) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.delete(`/api/bookingTable/${bookingId}`);
//       toast.success(response.data.message);
//       // Update local state without refetching
//       setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
//     } catch (error) {
//       console.error('Failed to delete booking:', error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message || 'Failed to delete booking.');
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleBookingClick = (booking: IBooking) => {
//     setSelectedBooking(booking);
//     setIsBookingDialogOpen(true);
//   };

//   const statusFilterButtonClasses = (status: 'all' | 'confirmed' | 'pending') =>
//     `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
//       filterStatus === status
//         ? 'bg-[#efa765] text-gray-900 shadow-lg'
//         : 'bg-[#1c2a3b] text-[#efa765] hover:bg-[#2a3c4f]'
//     }`;

//   // --- STATS CARD COMPONENT ---
//   const StatCard = ({ title, value, icon, iconColor, description }: { title: string, value: string | number, icon: React.ReactNode, iconColor: string, description: string }) => (
//     <Card className="bg-[#1c2a3b] border-[#efa765]/50 hover:border-[#efa765]/70 transition-all shadow-xl">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-gray-300 uppercase tracking-wider">{title}</CardTitle>
//         <div className={`${iconColor}`}>{icon}</div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-4xl font-bold text-[#efa765]">{value}</div>
//         <p className="text-xs text-gray-400 mt-1">{description}</p>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <>
//       <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 min-h-screen">
//         <div className="mb-8">
//           <h1
//             className="yeseva-one text-4xl font-bold mb-2 tracking-wide text-white"
//             style={{ color: 'rgb(239, 167, 101)' }}
//           >
//             Table Reservation Overview
//           </h1>
//           <p className="text-gray-400">
//             A comprehensive management dashboard for all restaurant table bookings.
//           </p>
//         </div>

//         {/* --- 1. STATISTICS CARDS --- */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
//           <StatCard
//             title="Total Bookings"
//             value={totalBookings}
//             icon={<LayoutDashboard className="h-5 w-5" />}
//             iconColor="text-[#efa765]"
//             description="Reservations retrieved from the system"
//           />
//           <StatCard
//             title="Confirmed"
//             value={confirmedBookingsCount}
//             icon={<CalendarCheck className="h-5 w-5" />}
//             iconColor="text-green-500"
//             description={`Success rate: ${percentageConfirmed}% confirmed`}
//           />
//           <StatCard
//             title="Pending Review"
//             value={pendingBookingsCount}
//             icon={<Clock className="h-5 w-5" />}
//             iconColor="text-yellow-500"
//             description={`${percentageConfirmed}% still awaiting confirmation`}
//           />
//           <StatCard
//             title="Total Guests"
//             value={bookings.reduce((sum, booking) => sum + booking.guests, 0)}
//             icon={<Users className="h-5 w-5" />}
//             iconColor="text-blue-400"
//             description="Total number of seats booked"
//           />
//         </div>

//         {/* --- 2. CONTROL PANEL (Search and Filter) --- */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 rounded-lg bg-[#141f2d] border border-[#efa765]/30">
//           <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
//             <Input
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 rounded-md bg-[#0d141b] text-white border border-[#efa765]/50 focus:border-[#efa765]"
//             />
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={() => setFilterStatus('all')}
//               className={statusFilterButtonClasses('all')}
//             >
//               All ({totalBookings})
//             </button>
//             <button
//               onClick={() => setFilterStatus('confirmed')}
//               className={statusFilterButtonClasses('confirmed')}
//             >
//               <CheckCircle className="h-4 w-4 mr-1 inline-block" /> Confirmed ({confirmedBookingsCount})
//             </button>
//             <button
//               onClick={() => setFilterStatus('pending')}
//               className={statusFilterButtonClasses('pending')}
//             >
//               <Clock className="h-4 w-4 mr-1 inline-block" /> Pending ({pendingBookingsCount})
//             </button>
//           </div>
//         </div>

//         {/* --- 3. BOOKINGS TABLE (using filteredBookings) --- */}
//         <div className="rounded-xl border border-[#efa765] bg-[#141f2d] text-white overflow-hidden shadow-2xl">
//           <div className="max-h-[60vh] overflow-y-auto">
//             <Table>
//               <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765] shadow-md z-10">
//                 <TableRow className="border-gray-700">
//                   <TableHead className="w-[150px] text-[#efa765] font-bold">Customer</TableHead>
//                   <TableHead className="w-[200px] text-[#efa765] font-bold">Email</TableHead>
//                   <TableHead className="text-[#efa765] font-bold">Date</TableHead>
//                   <TableHead className="text-[#efa765] font-bold">Time</TableHead>
//                   <TableHead className="text-center text-[#efa765] font-bold">Guests</TableHead>
//                   <TableHead className="w-[120px] text-center text-[#efa765] font-bold">Status</TableHead>
//                   <TableHead className="w-[150px] text-center text-[#efa765] font-bold">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
//                         <span className="ml-4 text-xl text-[#efa765]">Loading bookings...</span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : filteredBookings.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10 text-gray-400">
//                       {totalBookings === 0
//                         ? 'No table bookings found yet.'
//                         : `No bookings match the current filter and search criteria: "${filterStatus}" / "${searchTerm || 'All'}"`}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredBookings.map((booking) => (
//                     <TableRow key={booking._id} className="border-gray-700 hover:bg-[#1c2a3b] transition-colors duration-150 cursor-pointer" onClick={() => handleBookingClick(booking)}>
//                       <TableCell className="font-medium text-white truncate max-w-[150px]">{booking.name}</TableCell>
//                       <TableCell className="text-gray-300 truncate max-w-[200px]">{booking.email}</TableCell>
//                       <TableCell className="text-gray-400">
//                         {format(new Date(booking.date + 'T00:00:00'), 'MMM dd, yyyy')}
//                       </TableCell>
//                       <TableCell className="text-gray-400">{booking.time}</TableCell>
//                       <TableCell className="text-center text-gray-400">
//                         <div className="flex justify-center items-center font-semibold">
//                           {booking.guests} <Users className="h-4 w-4 ml-1 text-[#efa765]" />
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Badge
//                           className={`px-3 py-1 text-sm font-semibold ${
//                             booking.isConfirmed
//                               ? 'bg-green-700/20 text-green-300 border-green-700/40 hover:bg-green-700/40'
//                               : 'bg-yellow-700/20 text-yellow-300 border-yellow-700/40 hover:bg-yellow-700/40'
//                           }`}
//                         >
//                           {booking.isConfirmed ? 'Confirmed' : 'Pending'}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center space-x-2">
//                           <Button
//                             variant="default"
//                             size="icon"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleToggleConfirmation(booking._id, booking.isConfirmed);
//                             }}
//                             disabled={isActionLoading}
//                             className="h-8 w-8 transition-colors duration-200"
//                             style={{ backgroundColor: booking.isConfirmed ? '#dc2626' : '#22c55e' }}
//                           >
//                             {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
//                               booking.isConfirmed ? <CalendarX className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />
//                             )}
//                             <span className="sr-only">{booking.isConfirmed ? 'Mark as Pending' : 'Confirm Booking'}</span>
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 disabled={isActionLoading}
//                                 onClick={(e) => e.stopPropagation()} // Prevents opening the dialog
//                                 className="h-8 w-8 text-red-500 hover:bg-red-500/10 transition-colors duration-200"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 <span className="sr-only">Delete</span>
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
//                                 <AlertDialogDescription className="text-gray-300">
//                                   This action cannot be undone. This will permanently delete the booking for **{booking.name}** from your database.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleDeleteBooking(booking._id)}
//                                   className="bg-red-600 text-white hover:bg-red-700"
//                                 >
//                                   {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       {/* --- 4. BOOKING DETAIL DIALOG --- */}
//       <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-[#efa765]">
//           <DialogHeader>
//             <DialogTitle className="text-[#efa765] text-2xl font-bold border-b border-[#efa765]/50 pb-2">
//               Booking Details: {selectedBooking?.name}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="text-gray-400 space-y-3 pt-2">
//             <div className="flex justify-between border-b border-gray-700/50 pb-1">
//               <span className="font-bold text-gray-300">Email:</span>
//               <span className="truncate">{selectedBooking?.email}</span>
//             </div>
//             <div className="flex justify-between border-b border-gray-700/50 pb-1">
//               <span className="font-bold text-gray-300">Phone:</span>
//               <span>{selectedBooking?.phone || 'N/A'}</span>
//             </div>
//             <div className="flex justify-between border-b border-gray-700/50 pb-1">
//               <span className="font-bold text-gray-300">Date:</span>
//               <span>
//                 {selectedBooking?.date ? format(new Date(selectedBooking.date + 'T00:00:00'), 'EEEE, MMM dd, yyyy') : 'N/A'}
//               </span>
//             </div>
//             <div className="flex justify-between border-b border-gray-700/50 pb-1">
//               <span className="font-bold text-gray-300">Time:</span>
//               <span>{selectedBooking?.time}</span>
//             </div>
//             <div className="flex justify-between border-b border-gray-700/50 pb-1">
//               <span className="font-bold text-gray-300">Guests:</span>
//               <span className='flex items-center'>{selectedBooking?.guests} <Users className='h-4 w-4 ml-1 text-[#efa765]'/></span>
//             </div>
//             <div className="pt-4">
//                 <span className="font-bold text-gray-300 block mb-2">Current Status:</span>
//                 <Badge
//                     className={`text-base px-4 py-2 ${
//                         selectedBooking?.isConfirmed
//                             ? 'bg-green-600 hover:bg-green-700 text-white'
//                             : 'bg-yellow-600 hover:bg-yellow-700 text-white'
//                     }`}
//                 >
//                     {selectedBooking?.isConfirmed ? 'CONFIRMED' : 'PENDING'}
//                 </Badge>
//             </div>
//           </div>
//           <div className="bg-gray-800 p-4 rounded-md h-36 overflow-y-auto text-gray-200 border border-gray-700 mt-4">
//             <span className="font-bold text-[#efa765] block mb-1">Special Requests:</span>
//             <p className='mt-1 text-sm leading-relaxed'>
//               {selectedBooking?.requests || "No special requests were provided for this reservation."}
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }






'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
    Loader2,
    CalendarCheck,
    CalendarX,
    Trash2,
    Users,
    Search,
    CheckCircle,
    Clock,
    LayoutDashboard,
    XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Updated IBooking interface to use the string enum
interface IBooking {
    _id: string;
    name: string;
    email: string;
    phone: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    guests: number;
    isConfirmed: 'pending' | 'confirmed' | 'canceled'; // CHANGED to string enum
    requests?: string;
    // Add other required fields if necessary
}

// Type for API response errors
interface ErrorResponse {
    message?: string;
    success?: boolean;
}

// Helper to get Badge classes and text
const getBookingBadge = (status: IBooking['isConfirmed']) => {
    switch (status) {
        case 'confirmed':
            return {
                text: 'Confirmed',
                className: 'bg-green-700/20 text-green-300 border-green-700/40 hover:bg-green-700/40',
            };
        case 'pending':
            return {
                text: 'Pending',
                className: 'bg-yellow-700/20 text-yellow-300 border-yellow-700/40 hover:bg-yellow-700/40',
            };
        case 'canceled':
            return {
                text: 'Canceled',
                className: 'bg-red-700/20 text-red-300 border-red-700/40 hover:bg-red-700/40',
            };
        default:
            return {
                text: 'Unknown',
                className: 'bg-gray-700/20 text-gray-300 border-gray-700/40 hover:bg-gray-700/40',
            };
    }
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

    // --- NEW STATE FOR DETAILS/CONTROLS ---
    const [searchTerm, setSearchTerm] = useState('');
    // Updated filter status to include 'canceled'
    const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'canceled'>('all');
    // ---------------------------------------

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            // NOTE: This is the actual API call, no mock data is used here.
            const response = await axios.get('/api/bookingTable');
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to fetch bookings.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // --- DERIVED STATE (STATS) ---
    const totalBookings = bookings.length;
    const confirmedBookingsCount = bookings.filter(b => b.isConfirmed === 'confirmed').length;
    const pendingBookingsCount = bookings.filter(b => b.isConfirmed === 'pending').length;
    const canceledBookingsCount = bookings.filter(b => b.isConfirmed === 'canceled').length;
    const percentageConfirmed = totalBookings > 0 ? ((confirmedBookingsCount / totalBookings) * 100).toFixed(0) : 0;
    // -----------------------------

    // --- FILTERING LOGIC ---
    const filteredBookings = useMemo(() => {
        let currentBookings = bookings;

        // 1. Filter by Status
        if (filterStatus !== 'all') {
            currentBookings = currentBookings.filter(b => b.isConfirmed === filterStatus);
        }

        // 2. Filter by Search Term (Name or Email)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            currentBookings = currentBookings.filter(
                b => b.name.toLowerCase().includes(lowerCaseSearch) || b.email.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Sorting by date (newest first)
        return currentBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [bookings, filterStatus, searchTerm]);
    // -----------------------

    /**
     * Cycles the status through 'pending' -> 'confirmed' -> 'canceled' -> 'pending'.
     */
    const handleChangeStatus = async (bookingId: string, currentStatus: IBooking['isConfirmed']) => {
        setIsActionLoading(true);

        let newStatus: IBooking['isConfirmed'];
        
        switch (currentStatus) {
            case 'pending':
                newStatus = 'confirmed';
                break;
            case 'confirmed':
                newStatus = 'canceled';
                break;
            case 'canceled':
                newStatus = 'pending';
                break;
            default:
                newStatus = 'pending'; // Default to pending if unknown
        }

        try {
            const response = await axios.patch(`/api/bookingTable/${bookingId}`, {
                isConfirmed: newStatus,
            });
            toast.success(`Booking status updated to: ${newStatus.toUpperCase()}`);
            // Update local state without refetching
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, isConfirmed: newStatus } as IBooking : booking
                )
            );
        } catch (error) {
            console.error('Failed to update booking status:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to update booking status.');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Existing delete function is now a 'permanent delete'
    const handleDeleteBooking = async (bookingId: string) => {
        setIsActionLoading(true);
        try {
            const response = await axios.delete(`/api/bookingTable/${bookingId}`);
            toast.success(response.data.message);
            // Update local state without refetching
            setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
        } catch (error) {
            console.error('Failed to delete booking:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to delete booking.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBookingClick = (booking: IBooking) => {
        setSelectedBooking(booking);
        setIsBookingDialogOpen(true);
    };

    // Updated statusFilterButtonClasses to handle 'canceled'
    const statusFilterButtonClasses = (status: IBooking['isConfirmed'] | 'all') =>
        `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            filterStatus === status
                ? 'bg-[#efa765] text-gray-900 shadow-lg'
                : 'bg-[#1c2a3b] text-[#efa765] hover:bg-[#2a3c4f]'
        }`;

    // --- STATS CARD COMPONENT ---
    const StatCard = ({ title, value, icon, iconColor, description }: { title: string, value: string | number, icon: React.ReactNode, iconColor: string, description: string }) => (
        <Card className="bg-[#1c2a3b] border-[#efa765]/50 hover:border-[#efa765]/70 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300 uppercase tracking-wider">{title}</CardTitle>
                <div className={`${iconColor}`}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-[#efa765]">{value}</div>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </CardContent>
        </Card>
    );

    // Helper to determine next status info for the toggle button
    const getNextStatusInfo = (currentStatus: IBooking['isConfirmed']) => {
        switch (currentStatus) {
            case 'pending':
                return {
                    text: 'Confirm',
                    icon: <CalendarCheck className="h-4 w-4" />,
                    color: '#22c55e', // Green for Confirm
                };
            case 'confirmed':
                return {
                    text: 'Cancel',
                    icon: <XCircle className="h-4 w-4" />,
                    color: '#dc2626', // Red for Cancel
                };
            case 'canceled':
                return {
                    text: 'Pending',
                    icon: <Clock className="h-4 w-4" />,
                    color: '#eab308', // Yellow for Pending (Restore)
                };
            default:
                return {
                    text: 'Update',
                    icon: <Loader2 className="h-4 w-4" />,
                    color: '#64748b', // Gray for Unknown
                };
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 min-h-screen">
                <div className="mb-8">
                    <h1
                        className="yeseva-one text-4xl font-bold mb-2 tracking-wide text-white"
                        style={{ color: 'rgb(239, 167, 101)' }}
                    >
                        Table Reservation Overview
                    </h1>
                    <p className="text-gray-400">
                        A comprehensive management dashboard for all restaurant table bookings.
                    </p>
                </div>

                {/* --- 1. STATISTICS CARDS --- */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    <StatCard
                        title="Total Bookings"
                        value={totalBookings}
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        iconColor="text-[#efa765]"
                        description="Reservations retrieved from the system"
                    />
                    <StatCard
                        title="Confirmed"
                        value={confirmedBookingsCount}
                        icon={<CalendarCheck className="h-5 w-5" />}
                        iconColor="text-green-500"
                        description={`Success rate: ${percentageConfirmed}% confirmed`}
                    />
                    <StatCard
                        title="Pending Review"
                        value={pendingBookingsCount}
                        icon={<Clock className="h-5 w-5" />}
                        iconColor="text-yellow-500"
                        description={`${pendingBookingsCount} still awaiting confirmation`}
                    />
                    <StatCard
                        title="Canceled"
                        value={canceledBookingsCount}
                        icon={<CalendarX className="h-5 w-5" />}
                        iconColor="text-red-500"
                        description={`${canceledBookingsCount} reservations were canceled`}
                    />
                </div>

                {/* --- 2. CONTROL PANEL (Search and Filter) --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 rounded-lg bg-[#141f2d] border border-[#efa765]/30">
                    <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-md bg-[#0d141b] text-white border border-[#efa765]/50 focus:border-[#efa765]"
                        />
                    </div>

                    <div className="flex space-x-2 flex-wrap justify-end">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={statusFilterButtonClasses('all')}
                        >
                            All ({totalBookings})
                        </button>
                        <button
                            onClick={() => setFilterStatus('confirmed')}
                            className={statusFilterButtonClasses('confirmed')}
                        >
                            <CheckCircle className="h-4 w-4 mr-1 inline-block" /> Confirmed ({confirmedBookingsCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('pending')}
                            className={statusFilterButtonClasses('pending')}
                        >
                            <Clock className="h-4 w-4 mr-1 inline-block" /> Pending ({pendingBookingsCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('canceled')}
                            className={statusFilterButtonClasses('canceled')}
                        >
                            <XCircle className="h-4 w-4 mr-1 inline-block" /> Canceled ({canceledBookingsCount})
                        </button>
                    </div>
                </div>

                {/* --- 3. BOOKINGS TABLE (using filteredBookings) --- */}
                <div className="rounded-xl border border-[#efa765] bg-[#141f2d] text-white overflow-hidden shadow-2xl">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765] shadow-md z-10">
                                <TableRow className="border-gray-700">
                                    <TableHead className="w-[150px] text-[#efa765] font-bold">Customer</TableHead>
                                    <TableHead className="w-[200px] text-[#efa765] font-bold">Email</TableHead>
                                    <TableHead className="text-[#efa765] font-bold">Date</TableHead>
                                    <TableHead className="text-[#efa765] font-bold">Time</TableHead>
                                    <TableHead className="text-center text-[#efa765] font-bold">Guests</TableHead>
                                    <TableHead className="w-[120px] text-center text-[#efa765] font-bold">Status</TableHead>
                                    <TableHead className="w-[150px] text-center text-[#efa765] font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
                                                <span className="ml-4 text-xl text-[#efa765]">Loading bookings...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                                            {totalBookings === 0
                                                ? 'No table bookings found yet.'
                                                : `No bookings match the current filter and search criteria: "${filterStatus}" / "${searchTerm || 'All'}"`}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBookings.map((booking) => {
                                        const badge = getBookingBadge(booking.isConfirmed);
                                        const nextStatusInfo = getNextStatusInfo(booking.isConfirmed);

                                        return (
                                            <TableRow key={booking._id} className="border-gray-700 hover:bg-[#1c2a3b] transition-colors duration-150 cursor-pointer" onClick={() => handleBookingClick(booking)}>
                                                <TableCell className="font-medium text-white truncate max-w-[150px]">{booking.name}</TableCell>
                                                <TableCell className="text-gray-300 truncate max-w-[200px]">{booking.email}</TableCell>
                                                <TableCell className="text-gray-400">
                                                    {format(new Date(booking.date + 'T00:00:00'), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell className="text-gray-400">{booking.time}</TableCell>
                                                <TableCell className="text-center text-gray-400">
                                                    <div className="flex justify-center items-center font-semibold">
                                                        {booking.guests} <Users className="h-4 w-4 ml-1 text-[#efa765]" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`px-3 py-1 text-sm font-semibold ${badge.className}`}
                                                    >
                                                        {badge.text}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        {/* Single Status Cycle Button */}
                                                        <Button
                                                            variant="default"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleChangeStatus(booking._id, booking.isConfirmed);
                                                            }}
                                                            disabled={isActionLoading}
                                                            className="h-8 w-8 transition-colors duration-200"
                                                            style={{ backgroundColor: nextStatusInfo.color }}
                                                            title={`Click to set status to ${nextStatusInfo.text}`}
                                                        >
                                                            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : nextStatusInfo.icon}
                                                        </Button>
                                                        
                                                        {/* Delete Button (Permanent Delete) */}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={isActionLoading}
                                                                    onClick={(e) => e.stopPropagation()} // Prevents opening the detail dialog
                                                                    className="h-8 w-8 text-gray-500 hover:bg-gray-500/10 transition-colors duration-200"
                                                                    title="Permanently Delete Booking"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-300">
                                                                        This action **cannot be undone**. This will permanently delete the booking for **{booking.name}** from your database.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteBooking(booking._id)}
                                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                                    >
                                                                        {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'PERMANENTLY DELETE'}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* --- 4. BOOKING DETAIL DIALOG --- */}
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-[#efa765]">
                    <DialogHeader>
                        <DialogTitle className="text-[#efa765] text-2xl font-bold border-b border-[#efa765]/50 pb-2">
                            Booking Details: {selectedBooking?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-gray-400 space-y-3 pt-2">
                        <div className="flex justify-between border-b border-gray-700/50 pb-1">
                            <span className="font-bold text-gray-300">Email:</span>
                            <span className="truncate">{selectedBooking?.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700/50 pb-1">
                            <span className="font-bold text-gray-300">Phone:</span>
                            <span>{selectedBooking?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700/50 pb-1">
                            <span className="font-bold text-gray-300">Date:</span>
                            <span>
                                {selectedBooking?.date ? format(new Date(selectedBooking.date + 'T00:00:00'), 'EEEE, MMM dd, yyyy') : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700/50 pb-1">
                            <span className="font-bold text-gray-300">Time:</span>
                            <span>{selectedBooking?.time}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700/50 pb-1">
                            <span className="font-bold text-gray-300">Guests:</span>
                            <span className='flex items-center'>{selectedBooking?.guests} <Users className='h-4 w-4 ml-1 text-[#efa765]'/></span>
                        </div>
                        <div className="pt-4">
                            <span className="font-bold text-gray-300 block mb-2">Current Status:</span>
                            <Badge
                                className={`text-base px-4 py-2 ${getBookingBadge(selectedBooking?.isConfirmed || 'pending').className.replace(/ hover:bg-[\w/]+/g, '')}`}
                            >
                                {getBookingBadge(selectedBooking?.isConfirmed || 'pending').text.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-md h-36 overflow-y-auto text-gray-200 border border-gray-700 mt-4">
                        <span className="font-bold text-[#efa765] block mb-1">Special Requests:</span>
                        <p className='mt-1 text-sm leading-relaxed'>
                            {selectedBooking?.requests || "No special requests were provided for this reservation."}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

