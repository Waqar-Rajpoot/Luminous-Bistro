// "use client";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { User } from "next-auth"; // Keep User type for interface extension

// // Keep these imports for desktop navigation
// import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
// // Keep these imports for mobile navigation
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button"; // Keep Button for all buttons

// import { LogOut, LayoutDashboard } from "lucide-react"; // Keep icons for dashboard and logout

// // Extend the NextAuth User type to include your custom 'role' property
// // This block should ideally be in a global types file like src/types/next-auth.d.ts
// // but is placed here for direct example.
// declare module "next-auth" {
//   interface User {
//     role?: "user" | "admin" | "manager"; // Define possible roles
//     username?: string | null; // Assuming you might have a username
//   }
// }

// export default function Header() {
//   const { data: session, status } = useSession();
//   const user: User | undefined = session?.user as User | undefined;

//   const baseNavLinks = [
//     { name: "Home", href: "/" },
//     { name: "About", href: "/about" },
//     { name: "Menu", href: "/menu" },
//     { name: "Book a Table", href: "/book-a-table" },
//     { name: "Contact", href: "/contact" },
//     { name: "Products", href: "/products" },

//   ];

//   // Helper function to determine dashboard link and button text
//   const getDashboardLink = (role?: string) => {
//     switch (role) {
//       case "admin":
//         return { href: "/admin", text: "Admin Panel" };
//       case "manager":
//         return { href: "/manager", text: "Manager Dashboard" };
//       case "user":
//         return { href: "/user", text: "My Dashboard" };
//       default:
//         return null; // No dashboard for unauthenticated or unknown roles
//     }
//   };

//   const dashboardInfo = getDashboardLink(user?.role);

//   return (
//     <header className="border-b border-[#EFA765]/20 backdrop-blur-sm shadow-lg w-full">
//       <nav className="flex justify-between items-center px-2 sm:px-4 lg:px-4 py-4 md:py-6">
//         {/* Div 1: Logo */}
//         <div>
//           <Link
//             href="/"
//             className="logo yeseva-one tracking-wide drop-shadow-md transition-colors"
//           >
//             Luminous
//           </Link>
//         </div>

//         {/* Div 2: Desktop Navigation Links */}
//         <div className="hidden md:flex">
//           <Menubar className="h-auto border-none bg-transparent p-0 space-x-6">
//             {baseNavLinks.map((link) => (
//               <MenubarMenu key={link.name}>
//                 <MenubarTrigger
//                   className={`
//                     relative group cursor-pointer text-md menu-items py-2 px-0
//                     data-[state=open]:bg-transparent
//                   `}
//                 >
//                   <Link href={link.href}>{link.name}</Link>
//                 </MenubarTrigger>
//               </MenubarMenu>
//             ))}
//           </Menubar>
//         </div>

//         {/* Div 3: User/Auth Actions (Desktop) */}
//         <div className="hidden md:flex items-center space-x-4">
//           {status === "authenticated" ? (
//             <>
//               {dashboardInfo && ( // Show dashboard button if user has a defined role
//                 <Link href={dashboardInfo.href}>
//                   <Button
//                     // Decreased button font size: text-sm (approx. 14px from 16px)
//                     className="py-1 border border-[#EFA765]/20 px-3 rounded-lg text-sm hover:cursor-pointer shadow-md flex items-center gap-2"
//                     style={{
//                       color: "rgb(239, 167, 101)",
//                       backgroundColor: "rgb(20, 31, 45)",
//                     }}
//                   >
//                     <LayoutDashboard className="h-4 w-4" />
//                     {dashboardInfo.text}
//                   </Button>
//                 </Link>
//               )}
//               <Button
//                 onClick={() => signOut()}
//                 // Decreased button font size: text-sm (approx. 14px from 16px)
//                 className="py-1 border border-red-500 px-3 rounded-lg text-sm hover:cursor-pointer shadow-md flex items-center gap-2"
//                 style={{
//                   color: "rgb(239, 167, 101)",
//                   backgroundColor: "rgb(20, 31, 45)",
//                 }}
//               >
//                 <LogOut className="h-4 w-4" />
//                 Sign Out
//               </Button>
//             </>
//           ) : (
//             <Link href="/sign-in">
//               <Button
//                 className="py-2 border-none px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
//                 style={{
//                   color: "rgb(239, 167, 101)",
//                   backgroundColor: "rgb(20, 31, 45)",
//                 }}
//               >
//                 Sign In
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Navigation (Sheet) */}
//         <div className="md:hidden flex items-center rounded-md">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="hover:bg-card-background/50"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="h-8 w-8 font-bold border-[#efa765] border hover:cursor-pointer"
//                 >
//                   <path
//                     className="text-[#efa765]"
//                     fillRule="evenodd"
//                     d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="sr-only">Toggle navigation menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent
//               side="right"
//               className="border-l border-border-dark text-text-light w-[250px] sm:w-[300px]"
//               style={{
//                 backgroundColor: "rgb(35, 37, 51)",
//                 borderColor: "rgb(239, 167, 101)",
//               }}
//             >
//               <SheetHeader
//                 className="pb-6 border-b"
//                 style={{ borderColor: "rgb(239, 167, 101)" }}
//               >
//                 <SheetTitle className="sheet-title text-center">
//                   Luminous
//                 </SheetTitle>
//               </SheetHeader>
//               <nav className="flex flex-col space-y-4 mt-6">
//                 {baseNavLinks.map((link) => (
//                   <Link
//                     key={link.name}
//                     href={link.href}
//                     className={`
//                       block py-2 px-4 rounded-lg text-xl font-sans text-center
//                       text-text-light hover:bg-card-background/50 transition-colors
//                     `}
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     {link.name}
//                   </Link>
//                 ))}

//                 {/* Conditional rendering for Dashboard/Sign In/Sign Out on Mobile */}
//                 {status === "authenticated" ? (
//                   <>
//                     {dashboardInfo && (
//                       <Link href={dashboardInfo.href}>
//                         <Button
//                           // Decreased button font size: text-lg (maintained for mobile usability)
//                           className="w-full py-2 px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md flex items-center justify-center gap-2"
//                           style={{
//                             backgroundColor: "rgb(239, 167, 101)",
//                             color: "rgb(20, 31, 45)",
//                           }}
//                         >
//                           <LayoutDashboard className="h-5 w-5" />
//                           {dashboardInfo.text}
//                         </Button>
//                       </Link>
//                     )}
//                     <Button
//                       onClick={() => signOut()}
//                       // Decreased button font size: text-lg (maintained for mobile usability)
//                       className="w-full py-2 px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md mt-4 flex items-center justify-center gap-2"
//                       style={{
//                         backgroundColor: "rgb(20, 31, 45)",
//                         color: "rgb(239, 167, 101)",
//                         border: "1px solid rgb(239, 167, 101)",
//                       }}
//                     >
//                       <LogOut className="h-5 w-5" />
//                       Sign Out
//                     </Button>
//                   </>
//                 ) : (
//                   <Link
//                     href="/sign-in"
//                     className={`
//                       block py-2 px-4 rounded-lg text-xl font-sans text-center
//                       text-text-light hover:bg-card-background/50 transition-colors
//                       mt-4
//                     `}
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Sign In
//                   </Link>
//                 )}
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </nav>
//     </header>
//   );
// }









"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

// Extend the NextAuth User type to include your custom 'role' property
declare module "next-auth" {
  interface User {
    role?: "user" | "admin" | "manager" | "staff";
    username?: string | null;
  }
}

export default function Header() {
  const { data: session, status } = useSession();
  const user: User | undefined = session?.user as User | undefined;
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Measure the header height after it mounts
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    
    // Recalculate height on window resize
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Book a Table", href: "/book-a-table" },
    { name: "Contact", href: "/contact" },
    { name: "Products", href: "/products" },
  ];

  const getDashboardLink = (role?: string) => {
    switch (role) {
      case "admin":
        return { href: "/admin", text: "Admin Panel" };
      case "manager":
        return { href: "/manager-dashboard", text: "Manager Dashboard" };
      case "user":
        return { href: "/user-dashboard", text: "My Dashboard" };
      case "staff":
        return { href: "/staff-dashboard", text: "Staff Dashboard" };
      default:
        return null;
    }
  };

  const dashboardInfo = getDashboardLink(user?.role);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 w-full bg-[#141F2D]/90 border-b border-[#EFA765]/20 backdrop-blur-sm z-50"
      >
        <nav className="flex justify-between items-center px-2 sm:px-4 lg:px-4 py-4 md:py-6">
          {/* Div 1: Logo */}
          <div>
            <Link
              href="/"
              className="logo yeseva-one tracking-wide drop-shadow-md transition-colors"
            >
              Luminous
            </Link>
          </div>

          {/* Div 2: Desktop Navigation Links */}
          <div className="hidden md:flex">
            <Menubar className="h-auto border-none bg-transparent p-0 space-x-6">
              {baseNavLinks.map((link) => (
                <MenubarMenu key={link.name}>
                  <MenubarTrigger
                    className={`
                      relative group cursor-pointer text-md menu-items py-2 px-0
                      data-[state=open]:bg-transparent
                    `}
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </MenubarTrigger>
                </MenubarMenu>
              ))}
            </Menubar>
          </div>

          {/* Div 3: User/Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <>
                {dashboardInfo && (
                  <Link href={dashboardInfo.href}>
                    <Button
                      className="py-1 border border-[#EFA765]/20 px-3 rounded-lg text-sm hover:cursor-pointer shadow-md flex items-center gap-2"
                      style={{
                        color: "rgb(239, 167, 101)",
                        backgroundColor: "rgb(20, 31, 45)",
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {dashboardInfo.text}
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => signOut()}
                  className="py-1 border border-[#EFA765]/20 px-3 rounded-lg text-sm hover:cursor-pointer shadow-md flex items-center gap-2"
                  style={{
                    color: "rgb(239, 167, 101)",
                    backgroundColor: "rgb(20, 31, 45)",
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  className="py-2 border-none px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
                  style={{
                    color: "rgb(239, 167, 101)",
                    backgroundColor: "rgb(20, 31, 45)",
                  }}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation (Sheet) */}
          <div className="md:hidden flex items-center rounded-md">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-card-background/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 font-bold border-[#efa765] border hover:cursor-pointer"
                  >
                    <path
                      className="text-[#efa765]"
                      fillRule="evenodd"
                      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l border-border-dark text-text-light w-[250px] sm:w-[300px]"
                style={{
                  backgroundColor: "rgb(35, 37, 51)",
                  borderColor: "rgb(239, 167, 101)",
                }}
              >
                <SheetHeader
                  className="pb-6 border-b"
                  style={{ borderColor: "rgb(239, 167, 101)" }}
                >
                  <SheetTitle className="sheet-title text-center">
                    Luminous
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {baseNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        block py-2 px-4 rounded-lg text-xl font-sans text-center
                        text-text-light hover:bg-card-background/50 transition-colors
                      `}
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Conditional rendering for Dashboard/Sign In/Sign Out on Mobile */}
                  {status === "authenticated" ? (
                    <>
                      {dashboardInfo && (
                        <Link href={dashboardInfo.href}>
                          <Button
                            className="w-full py-2 px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md flex items-center justify-center gap-2"
                            style={{
                              backgroundColor: "rgb(239, 167, 101)",
                              color: "rgb(20, 31, 45)",
                            }}
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            {dashboardInfo.text}
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={() => signOut()}
                        className="w-full py-2 px-4 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md mt-4 flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: "rgb(20, 31, 45)",
                          color: "rgb(239, 167, 101)",
                          border: "1px solid rgb(239, 167, 101)",
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link
                      href="/sign-in"
                      className={`
                        block py-2 px-4 rounded-lg text-xl font-sans text-center
                        text-text-light hover:bg-card-background/50 transition-colors
                        mt-4
                      `}
                      style={{ color: "rgb(239, 167, 101)" }}
                    >
                      Sign In
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* This spacer div pushes the content below the fixed header */}
      <div style={{ height: `${headerHeight}px` }} />
    </>
  );
}
