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
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";

type SupplierProps = {
  supplierId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

const SupplierTable = ({ suppliers }: { suppliers: SupplierProps[] }) => {
  const [supplierList, setSupplierList] = useState<SupplierProps[]>(suppliers);
  const [formData, setFormData] = useState({
    supplierId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user starts typing
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Supplier name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleCreateSupplier = async () => {
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
      const res = await fetch(`/api/supplier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create supplier");
      }

      const newSupplier = await res.json();
      setSupplierList((prevSuppliers) => [...prevSuppliers, newSupplier.supplier]);

      toast({
        variant: "default",
        title: "Supplier Created",
        description: `Supplier has been successfully created.`,
      });
      // Clear form and close modal
      setFormData({
        supplierId: "",
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "An error occurred while creating the supplier. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = (supplier: SupplierProps) => {
    setFormData({
      supplierId: supplier.supplierId,
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || "",
      address: supplier.address || "",
    });
    setIsEditMode(true); // Switch to edit mode
    setIsModalOpen(true); // Open modal
  };

  const handleUpdateSupplier = async () => {
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
      const res = await fetch(`/api/supplier/${formData.supplierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update supplier");
      }

      const updatedSupplier = await res.json();
      setSupplierList((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.supplierId === updatedSupplier.supplier.supplierId
            ? updatedSupplier.supplier
            : supplier
        )
      );

      toast({
        variant: "default",
        title: "Supplier Updated",
        description: `Supplier has been successfully updated.`,
      });
      // Clear form and close modal
      setFormData({
        supplierId: "",
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "An error occurred while updating the supplier. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) {
      toast({
        variant: "destructive",
        title: "No Supplier Selected",
        description: "Please select a supplier to delete.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/supplier/${supplierToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete supplier");
      }

      // Remove the supplier from the local state after successful deletion
      setSupplierList((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.supplierId !== supplierToDelete)
      );
      toast({
        variant: "default",
        title: "Supplier Deleted",
        description: `Supplier has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while deleting the supplier.",
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false); // Close the dialog after deletion
      setSupplierToDelete(null); // Clear the supplier to delete
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
            Supplier List
          </h2>
        </div>

        {/* New/Edit Supplier Dialog */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setFormData({
                supplierId: "",
                name: "",
                phone: "",
                email: "",
                address: "",
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
              New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {isEditMode ? "Edit Supplier" : "Create New Supplier"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Supplier Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter supplier name"
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
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 w-full ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-6">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300 w-full sm:w-auto"
                onClick={() => {
                  setFormData({
                    supplierId: "",
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
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
                onClick={isEditMode ? handleUpdateSupplier : handleCreateSupplier}
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
            A list of Suppliers.
          </TableCaption>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Supplier Name
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Phone
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Email
              </TableHead>
              <TableHead className="text-gray-800 dark:text-gray-100">
                Address
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
            {supplierList.map((supplier) => (
              <TableRow
                key={supplier.supplierId}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {supplier.name}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {supplier.phone}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {supplier.email || "No email"}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {supplier.address || "No address"}
                </TableCell>
                <TableCell className="text-right text-gray-700 dark:text-gray-300">
                  {new Date(supplier.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white w-full sm:w-auto"
                    onClick={() => handleEditSupplier(supplier)}
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white w-full sm:w-auto"
                    onClick={() => {
                      setSupplierToDelete(supplier.supplierId);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            Are you sure you want to delete this supplier? This action cannot be
            undone.
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
              onClick={handleDeleteSupplier}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupplierTable;