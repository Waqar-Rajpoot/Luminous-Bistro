// src/app/admin/messages/page.tsx (Updated for full-width cards)
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, Mail, MailOpen, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IContactMessage } from '@/models/ContactMessage.model'; // Assuming IContactMessage is exported

// Type for API response errors
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // For individual message actions

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/contact');
      setMessages(response.data.contactMessages || []);
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch contact messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    setIsActionLoading(true);
    try {
      const response = await axios.patch(`/api/contact/${messageId}`, {
        isRead: !currentStatus,
      });
      toast.success(response.data.message);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, isRead: !currentStatus } : message
        )
      );
    } catch (error) {
      console.error('Failed to update message status:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update message status.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsActionLoading(true);
    try {
      const response = await axios.delete(`/api/contact/${messageId}`);
      toast.success(response.data.message);
      setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to delete message.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-xl text-white">
      <h1 className="text-4xl font-bold mb-6 text-[#efa765]">Contact Messages Management</h1>
      <p className="text-lg mb-8">
        Review, respond to, and manage user inquiries and feedback.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
          <p className="ml-4 text-xl">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center p-8 border border-gray-700 rounded-md text-gray-400">
          <p className="text-xl">No contact messages found yet.</p>
        </div>
      ) : (
        // Changed this div from a grid to a simple container with vertical spacing
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`
                bg-gray-700 p-6 rounded-lg shadow-md border w-full // Added w-full here
                ${message.isRead ? 'border-gray-600' : 'border-[#efa765] ring-1 ring-[#efa765]'} 
                flex flex-col justify-between
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white truncate mr-4">
                    {message.name}
                  </h2>
                  <Badge variant={message.isRead ? 'default' : 'secondary'} className="px-3 py-1 text-sm">
                    {message.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Email:</span> {message.email}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium text-[#efa765]">Subject:</span> {message.subject}
                </p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {/* Display a truncated message preview */}
                  {message.message}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-600">
                <span>
                  Received: {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
                <div className="flex space-x-2">
                  {/* View Message Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:bg-blue-400/10">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Message</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white border border-[#efa765]">
                      <DialogHeader>
                        <DialogTitle className="text-[#efa765]">Message from {message.name}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Subject: {message.subject} <br />
                          Email: {message.email} <br />
                          Received: {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 p-4 bg-gray-700 rounded-md text-gray-200 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                        {message.message}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Toggle Read Status Button */}
                  <Button
                    variant={message.isRead ? 'destructive' : 'default'} // Style based on current read status
                    size="icon"
                    onClick={() => handleToggleReadStatus(message._id, message.isRead)}
                    disabled={isActionLoading}
                    className="h-8 w-8"
                    style={{ backgroundColor: message.isRead ? '#dc2626' : '#22c55e' }}
                  >
                    {isActionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {!isActionLoading && (message.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />)}
                    <span className="sr-only">{message.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                  </Button>

                  {/* Delete Message Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isActionLoading}
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          This action cannot be undone. This will permanently delete the message from your database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMessage(message._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}