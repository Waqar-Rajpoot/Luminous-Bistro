// components/menu-management/MenuFormDialog.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";

// Shadcn UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Custom components & types
import FileUpload from "@/components/MediaUploader"; // Adjust path as needed
import { MenuItem, MenuFormInputs } from "./MenuManagementPage"; // Adjust path as needed
import ProductFields from "./ProductFields";

interface MenuFormDialogProps {
  isMenuFormDialogOpen: boolean;
  setIsMenuFormDialogOpen: (open: boolean) => void;
  editingMenu: MenuItem | null;
  menuForm: UseFormReturn<MenuFormInputs>;
  onMenuFormSubmit: (data: MenuFormInputs) => Promise<void>;
  handleAddNewMenuClick: () => void;
}

const MenuFormDialog: React.FC<MenuFormDialogProps> = ({
  isMenuFormDialogOpen,
  setIsMenuFormDialogOpen,
  editingMenu,
  menuForm,
  onMenuFormSubmit,
  handleAddNewMenuClick,
}) => {
  const { isSubmitting } = menuForm.formState;

  return (
    <Dialog
      open={isMenuFormDialogOpen}
      onOpenChange={setIsMenuFormDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={handleAddNewMenuClick}
          className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Menu
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] md:max-w-[900px] bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white
          flex flex-col max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="yeseva-one text-[rgb(239,167,101)]">
            {editingMenu
              ? `Edit Menu: ${editingMenu.category}`
              : "Add New Menu Category"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingMenu
              ? "Make changes to this menu category and its products."
              : "Add a new menu category with its four main products."}
          </DialogDescription>
        </DialogHeader>

        <Form {...menuForm}>
          <form
            onSubmit={menuForm.handleSubmit(onMenuFormSubmit)}
            className="flex flex-col flex-grow"
          >
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 scrollbar-hide py-4 space-y-6">
              {/* Category and Image */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <FormField
                  control={menuForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-[#efa765]">
                        Category Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Burgers"
                          {...field}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={menuForm.control}
                  name="imageSrc"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-[#efa765]">
                        Category Image
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          onChange={field.onChange}
                          value={field.value}
                          name={field.name}
                          disabled={isSubmitting}
                          label="Upload category image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Fields */}
              <ProductFields form={menuForm} productNumber={1} defaultName="Classic Burger" />
              <ProductFields form={menuForm} productNumber={2} defaultName="Zinger Burger" />
              <ProductFields form={menuForm} productNumber={3} defaultName="Veggie Burger" />
              <ProductFields form={menuForm} productNumber={4} defaultName="Swiss Burger" />
              
            </div>
            
            <DialogFooter className="flex-shrink-0 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
                  </>
                ) : editingMenu ? (
                  "Save Changes"
                ) : (
                  "Add Menu"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuFormDialog;