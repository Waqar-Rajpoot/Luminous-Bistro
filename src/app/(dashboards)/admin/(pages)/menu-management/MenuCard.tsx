// components/menu-management/MenuCard.tsx
import React from "react";
import Image from "next/image";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MenuItem } from "./MenuManagementPage"; // Adjust path as needed

interface MenuCardProps {
  menu: MenuItem;
  handleEditMenuClick: (menu: MenuItem) => void;
  confirmDeleteMenu: (menu: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  handleEditMenuClick,
  confirmDeleteMenu,
}) => {
  // Helper to safely format price (handles potential null/undefined)
  const formatPrice = (price: number | undefined) =>
    (price ?? 0).toLocaleString();

  return (
    <div
      key={menu._id}
      className="relative bg-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600"
    >
      {/* Image Section */}
      <div className="relative w-full h-48">
        <Image
          src={menu.imageSrc || "/placeholder-image.jpg"} // Fallback placeholder
          alt={menu.category}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2 text-[#efa765] truncate">
          {menu.category}
        </h3>
        <div className="space-y-1 text-gray-200 text-sm">
          <p>
            <span className="font-semibold">{menu.p1name}</span>: PKR{" "}
            {formatPrice(menu.p1price)}
          </p>
          <p>
            <span className="font-semibold">{menu.p2name}</span>: PKR{" "}
            {formatPrice(menu.p2price)}
          </p>
          <p>
            <span className="font-semibold">{menu.p3name}</span>: PKR{" "}
            {formatPrice(menu.p3price)}
          </p>
          <p>
            <span className="font-semibold">{menu.p4name}</span>: PKR{" "}
            {formatPrice(menu.p4price)}
          </p>
        </div>
      </div>

      {/* Actions Dropdown */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-bold text-gray-700 bg-[#efa765] hover:cursor-pointer hover:bg-[#efa765]"
            >
              <span className="sr-only">Open menu actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-gray-800 border-gray-700 text-white"
          >
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
  );
};

export default MenuCard;