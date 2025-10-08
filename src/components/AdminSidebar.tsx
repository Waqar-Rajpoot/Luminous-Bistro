'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Utensils,
  Box,
  LayoutDashboard,
  Settings,
  Menu,
  Star, 
  MessageSquare, 
  CalendarCheck, 
  ListOrdered,
  Users,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminSheetNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }, // A central admin dashboard
    { href: '/admin/menu-management', label: 'Menu Management', icon: Utensils },
    { href: '/admin/product-management', label: 'Product Management', icon: Box },
    { href: '/admin/orders', label: 'Order Management', icon: ListOrdered }, // New: Order Management
    { href: '/admin/reviews', label: 'User Reviews', icon: Star }, // New: User Reviews
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/messages', label: 'Contact Messages', icon: MessageSquare }, // New: Contact Messages
    { href: '/admin/bookings', label: 'Booked Tables', icon: CalendarCheck }, // New: Booked Tables
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="p-2 h-8 w-8 bg-[#141f2d] text-[#efa765] border-[#efa765] hover:bg-[#efa765] hover:text-[#141f2d] transition-colors mt-3 ml-3"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Admin Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-gray-900 text-white p-6 border-r border-[#efa765]"
        style={{
          backgroundColor: "rgb(35, 37, 51)",
          borderColor: "rgb(239, 167, 101)",
        }}
      >
        <SheetHeader className="pb-2 border-b" style={{ borderColor: "rgb(239, 167, 101)" }}>
          <SheetTitle className="yeseva-one text-2xl font-bold text-[#efa765] text-center">Admin Panel</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-6">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`flex items-center p-2 rounded-lg transition-colors text-sm
                  ${pathname === link.href ? 'bg-[#efa765] text-[#141f2d] font-bold shadow-md' : 'hover:bg-gray-700 text-gray-300'}`}>
                  <link.icon className="mr-2 h-3.5 w-3.5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
