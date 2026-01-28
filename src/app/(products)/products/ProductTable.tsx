"use client";
import { useEffect, useState } from "react";
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
import { app } from "firebase-admin";
import { ProductsProps } from "@/global/types";

const ProductTable = ({
  products,
  categories,
}: {
  products: ProductsProps[];
  categories: any[];
}) => {
  // Create a mapping of categoryId to category name
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.categoryId] = category.name; // Create a mapping of categoryId to name
    return acc;
  }, {});
  const [productList, setProductList] = useState<ProductsProps[]>(products);
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    description: "",
    categoryId: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    categoryId: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [filterByCategory, setFilterByCategory] = useState<number | null>(null);

  useEffect(() => {
    applyFilter();
  }, [filterByCategory]);
  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const applyFilter = () => {
    if (filterByCategory) {
      const filteredProducts = products.filter(
        (product) => product.categoryId === filterByCategory
      );
      setProductList(filteredProducts);
    } else {
      setProductList(products);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user starts typing
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, categoryId: +value });
    setErrors({ ...errors, categoryId: "" }); // Clear category error on change
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form Error",
        description: "Please correct the highlighted fields before submitting.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      const newProduct = await res.json();
      setProductList((prevProducts: ProductsProps[]) => [
        ...prevProducts,
        newProduct.product,
      ]);

      toast({
        variant: "default",
        title: "Product Created",
        description: `Product has been successfully created.`,
      });
      // Clear form and close modal
      setFormData({
        productId: "",
        name: "",
        description: "",
        categoryId: 0,
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "An error occurred while creating the product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: ProductsProps) => {
    setFormData({
      productId: product.productId,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
    });
    setIsEditMode(true); // Switch to edit mode
    setIsModalOpen(true); // Open modal
  };

  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form Error",
        description: "Please correct the highlighted fields before submitting.",
      });
      return;
    } // Don't proceed if form is invalid

    try {
      setLoading(true);
      const res = await fetch(`/api/product/${formData.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await res.json();
      setProductList((prevProducts: ProductsProps[]) =>
        prevProducts.map((product) =>
          product.productId === updatedProduct.product.productId
            ? updatedProduct.product
            : product
        )
      );

      toast({
        variant: "default",
        title: "Product Updated",
        description: `Product has been successfully updated.`,
      });
      // Clear form and close modal
      setFormData({
        productId: "",
        name: "",
        description: "",
        categoryId: 0,
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "An error occurred while updating the product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) {
      toast({
        variant: "destructive",
        title: "No Product Selected",
        description: "Please select a product to delete.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/product/${productToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the product from the local state after successful deletion
      setProductList((prevProducts: ProductsProps[]) =>
        prevProducts.filter((product) => product.productId !== productToDelete)
      );
      toast({
        variant: "default",
        title: "Product Deleted",
        description: `Product has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while deleting the product.",
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false); // Close the dialog after deletion
      setProductToDelete(null); // Clear the product to delete
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 sm:px-6 lg:px-8">
        <div className="">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left mb-4">
            Product List
          </h2>

          <select
            value={filterByCategory || ""}
            onChange={(e) =>
              setFilterByCategory(
                e.target.value === "" ? null : parseInt(e.target.value)
              )
            }
            className="border p-2 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-800"
          >
            <option value="">Filter by Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        >
          <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300 w-full sm:w-auto"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white w-full sm:w-auto"
                onClick={handleDeleteProduct}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New/Edit Product Dialog */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setFormData({
                productId: "",
                name: "",
                description: "",
                categoryId: 0,
              });
              setIsEditMode(false);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white mt-4 sm:mt-0"
            >
              New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {isEditMode ? "Edit Product" : "Create New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
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
                  placeholder="Enter product description"
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
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={formData.categoryId.toString()}
                  className={`mt-1 w-full ${
                    errors.categoryId
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.categoryId}
                        value={category.categoryId.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-6">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300 w-full sm:w-auto"
                onClick={() => {
                  setFormData({
                    productId: "",
                    name: "",
                    description: "",
                    categoryId: 0,
                  });
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
                onClick={isEditMode ? handleUpdateProduct : handleCreateProduct}
                disabled={loading}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto px-4 sm:px-6 lg:px-8">
        <Table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
            A list of Products.
          </TableCaption>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Product Name
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Description
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Category
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
            {productList.map((product) => (
              <TableRow
                key={product.productId}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <TableCell className="flex text-gray-700 dark:text-gray-300 text-nowrap">
                  <span>{product.category.name}</span>
                  <div className="border-r-2 border-r-white mx-2" />{" "}
                  <span>{product.name}</span>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {product.description || "No description"}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {categoryMap[product.categoryId] || "Unknown Category"}
                </TableCell>
                <TableCell className="text-right text-gray-700 dark:text-gray-300">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white w-full sm:w-auto"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  {/* <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white w-full sm:w-auto"
              onClick={() => openDeleteDialog(product.productId)}
            >
              Delete
            </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductTable;
