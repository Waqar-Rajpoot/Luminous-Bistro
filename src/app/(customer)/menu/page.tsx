"use client";

import { Image } from "@imagekit/next";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react"; // For loading spinner
import { toast } from "sonner"; // For notifications

import {
  IMAGEKIT_URL_ENDPOINT,
  aboutImage1Src,
} from "@/utils/imagekit-images";

// Import the Mongoose interface for better typing - Adjust path as needed
import { IMenu } from '@/models/Menu.model'; // Assuming IMenu is in this path

// Define a client-side type for a menu item, extending IMenu with _id
type MenuItem = IMenu & { _id: string };

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/menu"); // Your API endpoint to fetch all menus
        if (response.data.success) {
          setMenus(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch menus.");
        }
      } catch (err: any) {
        console.error("Error fetching menus:", err);
        setError(err.response?.data?.message || err.message || "Failed to load menu items.");
        toast.error(err.response?.data?.message || err.message || "Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141f2d] flex flex-col items-center justify-center p-8 text-white">
        <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
        <p className="mt-4 text-xl">Loading delicious menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141f2d] flex flex-col items-center justify-center p-8 text-red-500">
        <h2 className="text-3xl font-bold mb-4">Error Loading Menu</h2>
        <p className="text-lg text-center">{error}</p>
        <p className="text-sm text-gray-400 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="min-h-screen bg-[#141f2d] flex flex-col items-center justify-center p-8 text-white">
        <h2 className="yeseva-one text-[rgb(239,167,101)] text-5xl font-bold mb-4">No Menu Items Available</h2>
        <p className="text-lg text-center text-gray-400">It looks like our menu is currently being updated. Please check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Same as Home Page but with "The Menu" text */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {aboutImage1Src && (
          <Image
            urlEndpoint={IMAGEKIT_URL_ENDPOINT}
            src={aboutImage1Src}
            alt="A premium and Authentic Restaurant Interior"
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 w-full h-full object-cover rounded-b-[40px]"
          />
        )}
        <div className="absolute inset-0 bg-[rgba(20,31,45,0.8)] z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
          <h2 className="yeseva-one text-[80px] leading-[1.1] text-[rgb(239,167,101)] text-6xl md:text-8xl font-bold drop-shadow-lg text-center">
            The Menu
          </h2>
        </div>
      </div>

      {/* Dynamic Menu Sections */}
      {menus.map((menu, index) => (
        <section
          key={menu._id}
          className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}
            items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20`}
        >
          {/* Image Div */}
          <div className="lg:w-1/2 w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
            {menu.imageSrc && (
              <Image
                urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                src={menu.imageSrc}
                alt={menu.category}
                width={800}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
          </div>

          {/* Menu Item Name and Price (Four p tags) */}
          <div className="lg:w-1/2 w-full text-center lg:text-left p-4 space-y-6">
            <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
              Our {menu.category}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-xl md:text-2xl leading-relaxed flex justify-between items-baseline">
                <span className="font-semibold text-white">{menu.p1name}</span>
                <span className="text-[#efa765] font-bold">PKR: {menu.p1price.toLocaleString()}</span>
              </p>
              <p className="text-gray-300 text-xl md:text-2xl leading-relaxed flex justify-between items-baseline">
                <span className="font-semibold text-white">{menu.p2name}</span>
                <span className="text-[#efa765] font-bold">PKR: {menu.p2price.toLocaleString()}</span>
              </p>
              <p className="text-gray-300 text-xl md:text-2xl leading-relaxed flex justify-between items-baseline">
                <span className="font-semibold text-white">{menu.p3name}</span>
                <span className="text-[#efa765] font-bold">PKR: {menu.p3price.toLocaleString()}</span>
              </p>
              <p className="text-gray-300 text-xl md:text-2xl leading-relaxed flex justify-between items-baseline">
                <span className="font-semibold text-white">{menu.p4name}</span>
                <span className="text-[#efa765] font-bold">PKR: {menu.p4price.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}