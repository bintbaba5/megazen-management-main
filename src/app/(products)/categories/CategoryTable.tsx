"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Assuming you have a Dialog component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";
import { CategoriesProps } from "@/global/types";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryTable = ({ categories }: { categories: CategoriesProps[] }) => {
  const [categoryList, setCategoryList] = useState(categories);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user starts typing
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Category name is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleCreateCategory = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create Category");
      }

      const newCategory = await res.json();
      setCategoryList((prevCategories: CategoryProps[]) => [
        ...prevCategories,
        newCategory.category,
      ]);

      toast({
        variant: "default",
        title: "Success!",
        description: "Category created successfully.",
      });

      // Clear form and close modal
      setFormData({
        id: "",
        name: "",
        description: "",
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category. Please try again." + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: CategoryProps) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setIsEditMode(true); // Switch to edit mode
    setIsModalOpen(true); // Open modal
  };

  const handleUpdateCategory = async () => {
    if (!validateForm()) return; // Don't proceed if form is invalid

    try {
      setLoading(true);
      const res = await fetch(`/api/category/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      const updatedCategory = await res.json();
      setCategoryList((prevCategories: CategoryProps[]) =>
        prevCategories.map((category) =>
          category.id === updatedCategory.category.id
            ? updatedCategory.category
            : category
        )
      );
      toast({
        variant: "default",
        title: "Success!",
        description: "Category updated successfully.",
      });
      // Clear form and close modal
      setFormData({
        id: "",
        name: "",
        description: "",
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category. Please try again." + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/category/${categoryToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }

      toast({
        variant: "default",
        title: "Success!",
        description: "Category deleted successfully.",
      });

      // Remove the product from the local state after successful deletion
      setCategoryList((prevCategories: CategoryProps[]) =>
        prevCategories.filter((category) => category.id !== categoryToDelete)
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again." + error,
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false); // Close the dialog after deletion
      setCategoryToDelete(null); // Clear the product to delete
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 sm:px-6 lg:px-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left">
          Categories List
        </h2>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          handleDeleteCategory={handleDeleteCategory}
          isDeleteDialogOpen={isDeleteDialogOpen}
          loading={loading}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />

        {/* New/Edit Category Dialog */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setFormData({ id: "", name: "", description: "" });
              setIsEditMode(false);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white mt-4 sm:mt-0"
            >
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {isEditMode ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 w-full ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 w-full ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-6">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300 w-full sm:w-auto"
                onClick={() => {
                  setFormData({ id: "", name: "", description: "" });
                  setIsEditMode(false);
                  setIsModalOpen(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white w-full sm:w-auto"
                onClick={
                  isEditMode ? handleUpdateCategory : handleCreateCategory
                }
                disabled={loading}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category List Table */}
      <div className="overflow-x-auto px-4 sm:px-6 lg:px-2">
        <Table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
            A list of Categories.
          </TableCaption>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Category Name
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Description
              </TableHead>
              <TableHead className="text-right text-gray-800 dark:text-gray-100">
                Created At
              </TableHead>
              <TableHead className="text-center text-gray-800 dark:text-gray-100">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Show skeleton loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />{" "}
                      {/* Category Name */}
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" /> {/* Description */}
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-[100px] ml-auto" />{" "}
                      {/* Created At */}
                    </TableCell>
                    <TableCell className="text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Skeleton className="h-8 w-[60px]" /> {/* Edit Button */}
                      <Skeleton className="h-8 w-[70px]" />{" "}
                      {/* Delete Button */}
                    </TableCell>
                  </TableRow>
                ))
              : // Render actual table rows
                categoryList.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right text-gray-700 dark:text-gray-300">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white w-full sm:w-auto"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white w-full sm:w-auto"
                        onClick={() => openDeleteDialog(category.id.toString())}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CategoryTable;
