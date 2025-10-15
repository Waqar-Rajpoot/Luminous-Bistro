import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import UserProfile from '@/components/user-dashboard/UserProfile';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const StaffDashboard = async ({
  params,
}: {
  params: { userId: string };
}
) => {
  const { userId } = params;

   const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      redirect("/sign-in");
    }
  const user: any = session.user;
  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <section>
          <UserProfile user={user} />
        </section>
      <div className='second-heading'>Staff dashboard features are under construction</div>
      </div>
    </div>
  )
}

export default StaffDashboard