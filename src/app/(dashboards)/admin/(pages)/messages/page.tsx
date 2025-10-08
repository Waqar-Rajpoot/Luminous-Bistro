// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios, { AxiosError } from "axios";
// import { toast } from "sonner";
// import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
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
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { IContactMessage } from "@/models/ContactMessage.model";

// // Type for API response errors
// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// export default function AdminMessagesPage() {
//   const [messages, setMessages] = useState<IContactMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] =
//     useState<IContactMessage | null>(null);

//   const fetchMessages = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get("/api/contact");
//       setMessages(response.data.contactMessages || []);
//     } catch (error) {
//       console.error("Failed to fetch contact messages:", error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(
//         axiosError.response?.data.message || "Failed to fetch contact messages."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   const handleToggleReadStatus = async (
//     messageId: string,
//     currentStatus: boolean
//   ) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.patch(`/api/contact/${messageId}`, {
//         isRead: !currentStatus,
//       });
//       toast.success(response.data.message);
//       setMessages((prevMessages) =>
//         prevMessages.map((message) =>
//           message._id === messageId
//             ? { ...message, isRead: !currentStatus }
//             : message
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update message status:", error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(
//         axiosError.response?.data.message || "Failed to update message status."
//       );
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleDeleteMessage = async (messageId: string) => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.delete(`/api/contact/${messageId}`);
//       toast.success(response.data.message);
//       setMessages((prevMessages) =>
//         prevMessages.filter((message) => message._id !== messageId)
//       );
//     } catch (error) {
//       console.error("Failed to delete message:", error);
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(
//         axiosError.response?.data.message || "Failed to delete message."
//       );
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleMessageClick = (message: IContactMessage) => {
//     setSelectedMessage(message);
//     setIsMessageDialogOpen(true);
//   };

//   return (
//     <>
//       <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
//         <div className="mb-6">
//           <h1
//             className="yeseva-one text-4xl font-bold mb-2 tracking-wide"
//             style={{ color: "rgb(239, 167, 101)" }}
//           >
//             Contact Messages Management
//           </h1>
//           <p className="text-gray-400">
//             Review, respond to, and manage user inquiries and feedback.
//           </p>
//         </div>
//         <div className="rounded-md border border-[#efa765] bg-[#141f2d] text-white overflow-hidden">
//           <div className="h-[400px] overflow-y-auto">
//             <Table>
//               <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765]">
//                 <TableRow>
//                   <TableHead className="w-[150px] text-[#efa765] font-bold">
//                     Customer
//                   </TableHead>
//                   <TableHead className="w-[200px] text-[#efa765] font-bold">
//                     Email
//                   </TableHead>
//                   <TableHead className="text-[#efa765] font-bold">
//                     Subject
//                   </TableHead>
//                   <TableHead className="text-[#efa765] font-bold">
//                     Message
//                   </TableHead>
//                   <TableHead className="w-[120px] text-center text-[#efa765] font-bold">
//                     Status
//                   </TableHead>
//                   <TableHead className="w-[150px] text-center text-[#efa765] font-bold">
//                     Date
//                   </TableHead>
//                   <TableHead className="w-[100px] text-center text-[#efa765] font-bold">
//                     Actions
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-10">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
//                         <span className="ml-4 text-xl text-[#efa765]">
//                           Loading messages...
//                         </span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : messages.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={6}
//                       className="text-center py-10 text-gray-400"
//                     >
//                       No contact messages found yet.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   messages.map((message) => (
//                     <TableRow
//                       key={message._id}
//                       className="border-gray-700 hover:bg-[#1c2a3b]"
//                     >
//                       <TableCell className="font-medium text-white">
//                         {message.name}
//                       </TableCell>
//                       <TableCell className="text-gray-300">
//                         {message.email}
//                       </TableCell>
//                       <TableCell className="text-gray-400 truncate max-w-[200px] transition-colors">
//                         {message.subject}
//                       </TableCell>
//                       <TableCell
//                         className="text-gray-400 truncate max-w-[200px] cursor-pointer hover:text-[#efa765] transition-colors"
//                         onClick={() => handleMessageClick(message)}
//                       >
//                         {message.message}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Badge
//                           variant={message.isRead ? "default" : "secondary"}
//                           className="px-3 py-1 text-sm"
//                         >
//                           {message.isRead ? "Read" : "Unread"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-gray-400 text-center text-sm">
//                         {format(new Date(message.createdAt), "MMM dd, yyyy")}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center space-x-2">
//                           <Button
//                             variant={message.isRead ? "destructive" : "default"}
//                             size="icon"
//                             onClick={() =>
//                               handleToggleReadStatus(
//                                 message._id,
//                                 message.isRead
//                               )
//                             }
//                             disabled={isActionLoading}
//                             className="h-8 w-8"
//                             style={{
//                               backgroundColor: message.isRead
//                                 ? "#dc2626"
//                                 : "#22c55e",
//                             }}
//                           >
//                             {isActionLoading ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : message.isRead ? (
//                               <Mail className="h-4 w-4" />
//                             ) : (
//                               <MailOpen className="h-4 w-4" />
//                             )}
//                             <span className="sr-only">
//                               {message.isRead
//                                 ? "Mark as Unread"
//                                 : "Mark as Read"}
//                             </span>
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 disabled={isActionLoading}
//                                 className="h-8 w-8 text-red-500 hover:bg-red-500/10"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 <span className="sr-only">Delete</span>
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-red-500">
//                                   Are you absolutely sure?
//                                 </AlertDialogTitle>
//                                 <AlertDialogDescription className="text-gray-300">
//                                   This action cannot be undone. This will
//                                   permanently delete the message from your
//                                   database.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">
//                                   Cancel
//                                 </AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() =>
//                                     handleDeleteMessage(message._id)
//                                   }
//                                   className="bg-red-600 text-white hover:bg-red-700"
//                                 >
//                                   {isActionLoading ? (
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                   ) : (
//                                     "Delete"
//                                   )}
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

//       <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-[#efa765]">
//           <DialogHeader>
//             <DialogTitle className="text-[#efa765] text-2xl font-bold">
//               Message from {selectedMessage?.name}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="text-gray-400">
//             <div className="mb-2">
//               <span className="font-bold text-gray-300">Email:</span>{" "}
//               {selectedMessage?.email}
//             </div>
//             <div className="mb-4">
//               <span className="font-bold text-gray-300">Subject:</span>{" "}
//               {selectedMessage?.subject}
//             </div>
//           </div>
//           <div className="bg-gray-800 p-4 rounded-md h-64 overflow-y-auto text-gray-200">
//             {selectedMessage?.message}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }





"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Mail, MailOpen, Trash2, Users } from "lucide-react"; // Removed ListPlus (Mock Stat Icon)
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock interface definition since actual IContactMessage is external
interface IContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string; // Using string since date-fns formats it later
    // Other fields like userId are omitted for brevity in mock interface
}

// Type for API response errors
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// --- Utility Component for Statistics ---
// Define the StatCard component within the file as required for single-file mandate
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`p-5 rounded-xl shadow-2xl border border-gray-700 ${bgColor} transition-all duration-300 hover:shadow-2xl hover:border-[#efa765]/70`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h2 className="text-4xl font-extrabold mt-1 text-white">{value}</h2>
            </div>
            <Icon className={`h-10 w-10 ${color} opacity-70`} />
        </div>
    </div>
);

// --- Main Admin Component ---
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<IContactMessage | null>(null);

  // --- Stats Calculation ---
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;
  const readMessages = totalMessages - unreadMessages;

  const stats = [
    {
      title: "Total Inquiries",
      value: totalMessages,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-[#141f2d]",
    },
    {
      title: "Unread Messages",
      value: unreadMessages,
      icon: Mail,
      color: "text-red-400",
      bgColor: "bg-[#141f2d]",
    },
    {
      title: "Resolved Messages",
      value: readMessages,
      icon: MailOpen,
      color: "text-green-400",
      bgColor: "bg-[#141f2d]",
    },
    // Removed "New Today (Mock)" stat
  ];

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetches data from the actual API endpoint
      const response = await axios.get("/api/contact");
      setMessages(response.data.contactMessages || []);

    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch contact messages."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleReadStatus = async (
    messageId: string,
    currentStatus: boolean
  ) => {
    setIsActionLoading(true);
    try {
      // Actual API call to update status
      const response = await axios.patch(`/api/contact/${messageId}`, { isRead: !currentStatus });
      
      toast.success(response.data.message || `Message marked as ${currentStatus ? 'Unread' : 'Read'}.`);

      // Update local state based on success
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId
            ? { ...message, isRead: !currentStatus }
            : message
        )
      );
    } catch (error) {
      console.error("Failed to update message status:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update message status."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsActionLoading(true);
    try {
      // Actual API call to delete message
      const response = await axios.delete(`/api/contact/${messageId}`);
      
      toast.success(response.data.message || "Message deleted successfully.");

      // Update local state to remove the message
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMessageClick = (message: IContactMessage) => {
    setSelectedMessage(message);
    setIsMessageDialogOpen(true);
    if (!message.isRead) {
        handleToggleReadStatus(message._id, false); 
    }
  };

  return (
    // Main container with dark background and rounded corners
    <div className="min-h-screen text-white p-4 sm:p-8 lg:p-12 yeseva-one">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 p-4 bg-[#141f2d] rounded-xl shadow-xl">
          <h1
            className="text-4xl sm:text-5xl mb-1 text-[#efa765] tracking-wide"
          >
            Inquiry Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            A comprehensive overview of all user inquiries and feedback.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Messages Table Section */}
        <div className="bg-[#141f2d] rounded-xl shadow-2xl border border-[#efa765]/30 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#efa765]">
                Recent Messages
            </h2>
            <Button 
                onClick={fetchMessages}
                disabled={isLoading || isActionLoading}
                className="bg-[#efa765] hover:bg-[#d6985c] text-gray-900 transition-colors"
            >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Refresh Data"}
            </Button>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="sticky top-0 bg-[#1c2a3b] shadow-md">
                <TableRow className="border-gray-700 hover:bg-[#1c2a3b]">
                  <TableHead className="w-[150px] text-[#efa765] font-bold">
                    Customer
                  </TableHead>
                  <TableHead className="w-[200px] text-[#efa765] font-bold hidden sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="w-[200px] text-[#efa765] font-bold">
                    Subject
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#efa765] font-bold">
                    Status
                  </TableHead>
                  <TableHead className="w-[150px] text-center text-[#efa765] font-bold hidden md:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#efa765] font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading State */}
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
                        <span className="ml-4 text-xl text-[#efa765]">
                          Loading messages...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  /* Empty State */
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-20 text-gray-500 text-lg"
                    >
                      All clear! No contact messages found yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  /* Message Rows */
                  messages.map((message) => (
                    <TableRow
                      key={message._id}
                      className={`border-gray-800 transition-colors cursor-pointer ${
                          message.isRead ? 'hover:bg-gray-800/50' : 'bg-[#1c2a3b] hover:bg-[#2a3c50]'
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <TableCell className="font-medium text-white max-w-[150px] truncate">
                        {message.name}
                      </TableCell>
                      <TableCell className="text-gray-400 hidden sm:table-cell max-w-[200px] truncate">
                        {message.email}
                      </TableCell>
                      <TableCell className={`max-w-[300px] truncate font-semibold ${message.isRead ? 'text-gray-500' : 'text-white'}`}>
                        {message.subject}
                      </TableCell>
                      
                      {/* Status Badge */}
                      <TableCell className="text-center">
                        <Badge
                          className={`px-3 py-1 text-xs font-semibold shadow-md ${
                            message.isRead 
                                ? "bg-green-600/20 text-green-400 border-green-600" 
                                : "bg-red-600/20 text-red-400 border-red-600"
                          } hover:opacity-80`}
                        >
                          {message.isRead ? "Read" : "New"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-gray-500 text-center text-xs hidden md:table-cell">
                        {format(new Date(message.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center space-x-2">
                          {/* Toggle Read Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleToggleReadStatus(
                                message._id,
                                message.isRead
                              )
                            }
                            disabled={isActionLoading}
                            className={`h-8 w-8 border-none shadow-md transition-all ${
                                message.isRead ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            }`}
                          >
                            {isActionLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : message.isRead ? (
                              <Mail className="h-4 w-4" /> // Mark as Unread
                            ) : (
                              <MailOpen className="h-4 w-4" /> // Mark as Read
                            )}
                            <span className="sr-only">Toggle Read Status</span>
                          </Button>
                          
                          {/* Delete Button (inside AlertDialog) */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={isActionLoading}
                                className="h-8 w-8 border-none text-gray-500 hover:text-red-500 hover:bg-gray-800/50 shadow-md transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 text-white border border-red-700 rounded-xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-red-500">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  This action cannot be undone. This will
                                  permanently delete the message from your
                                  database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none transition-colors">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteMessage(message._id)
                                  }
                                  className="bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                  {isActionLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    "Delete Message"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Message Content Dialog (Modal) */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border border-[#efa765] rounded-xl shadow-2xl">
          <DialogHeader className="border-b border-gray-700 pb-3">
            <DialogTitle className="text-[#efa765] text-2xl font-bold">
              Message from {selectedMessage?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="text-gray-400 p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between flex-wrap text-sm mb-2">
                    <p>
                        <span className="font-bold text-gray-300">Email:</span>{" "}
                        {selectedMessage.email}
                    </p>
                    <p>
                        <span className="font-bold text-gray-300">Date:</span>{" "}
                        {format(new Date(selectedMessage.createdAt), "MMM dd, yyyy @ HH:mm")}
                    </p>
                </div>
                <div className="text-lg font-semibold text-white">
                    <span className="font-bold text-gray-300">Subject:</span>{" "}
                    {selectedMessage.subject}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto text-gray-200 border border-gray-700/50 text-base shadow-inner">
                {selectedMessage.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
