// src/app/admin/layout.tsx
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getServerSession } from 'next-auth'; // For server-side auth check
import { redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/options';
import AdminSheetNav from '@/components/AdminSidebar';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side check for authentication and authorization
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    // Redirect to sign-in or an access denied page if not authenticated or not an admin
    redirect('/auth/signin'); // Or '/access-denied'
  }

  return (
    <div className="flex min-h-screen bg-[#141f2d]">
      {/* Admin Sidebar */}
      <AdminSheetNav />

      {/* Main Content Area for Admin Pages */}
      <main className="flex-1 p-8">
        {/* Use Suspense for client components or data fetching in children */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]"> {/* Adjust height */}
            <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
            <p className="text-white text-xl ml-4">Loading Admin Content...</p>
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}