// components/menu-management/MenuDeleteConfirmation.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MenuDeleteConfirmationProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  menuToDeleteCategory: string | null;
  executeDeleteMenu: () => void;
}

const MenuDeleteConfirmation: React.FC<MenuDeleteConfirmationProps> = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  menuToDeleteCategory,
  executeDeleteMenu,
}) => {
  return (
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="yeseva-one text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete the menu
            category:
            <br />
            <span className="font-bold text-white text-lg">
              {menuToDeleteCategory}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={executeDeleteMenu}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MenuDeleteConfirmation;