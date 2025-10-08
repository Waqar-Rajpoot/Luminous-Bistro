// pages/admin/MenuManagementPage.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import * as zod from "zod";

// Import schema and type from your file - Adjust paths as needed
import { menuSchema } from "@/schemas/menuSchema";
import { IMenu } from "@/models/Menu.model"; 

// Import the new components
import MenuFormDialog from "./MenuFormDialog";
import MenuCard from "./MenuCard";
import MenuDeleteConfirmation from "./MenuDeleteConfirmation";

// Define client-side types (Moved here for easy import into child components)
export type MenuItem = IMenu & { _id: string };
// Infer the form input type from your Zod schema
export type MenuFormInputs = zod.infer<typeof menuSchema> & { _id?: string };

// --- Main Component ---

export default function MenuManagementPage() {
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [isMenuFormDialogOpen, setIsMenuFormDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  // State for Menu Deletion Confirmation Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuToDeleteId, setMenuToDeleteId] = useState<string | null>(null);
  const [menuToDeleteCategory, setMenuToDeleteCategory] = useState<
    string | null
  >(null);

  // React Hook Form for Menu Management (Add/Edit)
  const menuForm = useForm<MenuFormInputs>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      category: "",
      p1name: "",
      p1price: 0,
      p2name: "",
      p2price: 0,
      p3name: "",
      p3price: 0,
      p4name: "",
      p4price: 0,
      imageSrc: "",
    },
  });

  // --- Data Fetching ---
  const fetchMenus = useCallback(async () => {
    setLoadingMenus(true);
    try {
      const response = await axios.get("/api/menu");
      if (response.data.success) {
        setMenus(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch menus.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load menus."
      );
      console.error("Error fetching menus:", error);
    } finally {
      setLoadingMenus(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchMenus();
    }
  }, [status, session, fetchMenus]);

  // --- Menu Management Handlers ---

  const handleAddNewMenuClick = () => {
    setEditingMenu(null); // Clear any editing state
    menuForm.reset({
      // Reset to default values for adding
      category: "",
      p1name: "",
      p1price: 0,
      p2name: "",
      p2price: 0,
      p3name: "",
      p3price: 0,
      p4name: "",
      p4price: 0,
      imageSrc: "",
    });
    // Dialog state change is handled by DialogTrigger
  };

  const handleEditMenuClick = (menu: MenuItem) => {
    setEditingMenu(menu);
    // Populate form with menu data
    menuForm.reset({
      _id: menu._id, // Set the ID for update
      category: menu.category,
      p1name: menu.p1name,
      p1price: menu.p1price,
      p2name: menu.p2name,
      p2price: menu.p2price,
      p3name: menu.p3name,
      p3price: menu.p3price,
      p4name: menu.p4name,
      p4price: menu.p4price,
      imageSrc: menu.imageSrc,
    });
    setIsMenuFormDialogOpen(true); // Programmatically open dialog for editing
  };

  // Initiates menu deletion confirmation dialog
  const confirmDeleteMenu = (menu: MenuItem) => {
    setMenuToDeleteId(menu._id);
    setMenuToDeleteCategory(menu.category);
    setShowDeleteConfirm(true);
  };

  // Actual menu deletion logic, called after AlertDialog confirmation
  const executeDeleteMenu = async () => {
    if (!menuToDeleteId) return;
    try {
      const response = await axios.delete(`/api/menu/${menuToDeleteId}`);
      if (response.data.success) {
        toast.success(`Menu "${menuToDeleteCategory}" deleted successfully!`);
        fetchMenus(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to delete menu.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete menu."
      );
      console.error("Error deleting menu:", error);
    } finally {
      setMenuToDeleteId(null);
      setMenuToDeleteCategory(null);
      setShowDeleteConfirm(false);
    }
  };

  const onMenuFormSubmit = async (data: MenuFormInputs) => {
    const url = editingMenu ? `/api/menu/${editingMenu._id}` : "/api/menu";
    try {
      const response = editingMenu
        ? await axios.put(url, data)
        : await axios.post(url, data);

      if (response.data.success) {
        toast.success(
          `Menu ${editingMenu ? "updated" : "added"} successfully!`
        );
        setIsMenuFormDialogOpen(false); // Close on success
        menuForm.reset(); // Reset form
        fetchMenus(); // Refresh the list
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${editingMenu ? "update" : "add"} menu.`
        );
      }
    } catch (error: any) {
      console.error(
        "Menu form submission error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${editingMenu ? "update" : "add"} menu.`
      );
    }
  };

  // --- Authentication and Authorization Check ---
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#141f2d] flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
        <p className="text-white text-xl ml-4">Loading Admin Panel...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    redirect("/auth/signin");
    return null;
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#141f2d] p-8 text-white">
      <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl md:text-6xl font-bold text-center mb-12 drop-shadow-lg">
        Menu Management
      </h1>

      <section className="mb-12 bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold">
            Menu Categories
          </h2>

          <MenuFormDialog
            isMenuFormDialogOpen={isMenuFormDialogOpen}
            setIsMenuFormDialogOpen={setIsMenuFormDialogOpen}
            editingMenu={editingMenu}
            menuForm={menuForm}
            onMenuFormSubmit={onMenuFormSubmit}
            handleAddNewMenuClick={handleAddNewMenuClick}
          />
        </div>

        {/* Display existing menus as cards */}
        {loadingMenus ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-[#efa765]" />
            <p className="ml-3 text-lg">Loading menus...</p>
          </div>
        ) : menus.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No menus found. Add one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <MenuCard
                key={menu._id}
                menu={menu}
                handleEditMenuClick={handleEditMenuClick}
                confirmDeleteMenu={confirmDeleteMenu}
              />
            ))}
          </div>
        )}
      </section>

      {/* Menu Delete Confirmation Dialog */}
      <MenuDeleteConfirmation
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        menuToDeleteCategory={menuToDeleteCategory}
        executeDeleteMenu={executeDeleteMenu}
      />
    </div>
  );
}