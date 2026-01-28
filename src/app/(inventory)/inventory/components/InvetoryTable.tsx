"use client";
import React, { useEffect, useState } from "react";

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
import Modal from "@/components/Modal";
import InventoryForm from "./InventoryForm";
import {
  InventoryProps,
  ProductProps,
  CategoryProps,
} from "../../generalTypes";
import {
  deleteResource,
  getAllResources,
  updateResource,
} from "@/app/api/HandleResource";
import { AlertDialogComponent } from "@/components/AlertDialog";
import StockTransferForm from "./StockTransferForm";
import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";
// import { set } from "date-fns";

type Props = {
  inventories: InventoryProps[];
  locations: { locationId: number; locationName: string }[];
};
const InventoryTable = ({ inventories, locations }: Props) => {
  const [allInventories, setAllInventories] =
    useState<InventoryProps[]>(inventories);
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [updatedInventory, setUpdatedInventory] =
    useState<InventoryProps | null>(null);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [filteredInventories, setFilteredInventories] =
    useState<InventoryProps[]>(inventories);
  const [filterProduct, setFilterProduct] = useState<number | null>(null);
  const [filterByCategory, setFilterByCategory] = useState<number | null>(null);
  const [filterLocation, setFilterLocation] = useState<number | null>(null);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryProps | null>(null);

  useEffect(() => {
    handleGetProducts();
  }, []);
  useEffect(() => {
    handleGetCategories();
  }, []);

  useEffect(() => {
    handleGet();
  }, [isCreated]);

  useEffect(() => {
    applyFilters();
  }, [filterProduct, filterLocation, filterByCategory]);

  const handleEdit = (inventory: InventoryProps) => {
    setEditingInventoryId(
      inventory?.inventoryId ? inventory?.inventoryId : null
    );
    setUpdatedInventory({ ...inventory });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof InventoryProps
  ) => {
    if (updatedInventory) {
      setUpdatedInventory({
        ...updatedInventory,
        [field]:
          field === "quantity" ? parseInt(e.target.value) : e.target.value,
      });
    }
  };

  // const handleFetchInventory = async (inventoryId: number) => {
  //   try {
  //     const response = await fetch(`/api/inventory/${inventoryId}`);
  //     const data = await response.json();

  const handleGetProducts = async () => {
    try {
      const response = await fetch("/api/product");
      const { products } = await response.json();
      setProducts(products as ProductProps[]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products. Please try again later.",
      });
    }
  };

  const handleGetCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories. Please try again later.",
      });
    }
  };

  const handleGet = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inventory");
      const { inventories } = await response.json();
      if (inventories as InventoryProps[]) {
        setAllInventories(inventories);
        setFilteredInventories(inventories);
      } else {
        console.error("Failed to fetch inventory data.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory data. Please try again later.",
      });
    } finally {
      setLoading(false); // Optional: Clear loading state
    }
  };

  const handleCreate = () => {
    setIsCreated(!isCreated);
  };

  // const handleUpdate = async () => {
  //   if (updatedInventory) {
  //     setLoading(true);
  //     try {
  //       await updateResource("/api/inventory", updatedInventory);
  //       setAllInventories(
  //         allInventories.map((inventory) =>
  //           inventory.inventoryId === updatedInventory.inventoryId
  //             ? updatedInventory
  //             : inventory
  //         )
  //       );
  //       setEditingInventoryId(null);
  //       await handleGet();
  //     } catch (error) {
  //       console.error("Error updating inventory:", error);
  //     }
  //   }
  // };

  const handleUpdate = async () => {
    if (updatedInventory) {
      setLoading(true); // Set loading state to true when the update starts

      try {
        await updateResource("/api/inventory", updatedInventory);

        // Update the inventory in the state
        setAllInventories(
          allInventories.map((inventory) =>
            inventory.inventoryId === updatedInventory.inventoryId
              ? updatedInventory
              : inventory
          )
        );
        setEditingInventoryId(null);
        toast({
          variant: "default",
          title: "Success",
          description: "Inventory updated successfully.",
        });
        await handleGet();
        // applyFilters();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update inventory. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (inventoryId: number) => {
    setLoading(true); // Start loading state

    try {
      await deleteResource("/api/inventory", inventoryId);
      setAllInventories((prev) =>
        prev.filter((inventory) => inventory.inventoryId !== inventoryId)
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Inventory deleted successfully.",
      });
      await handleGet();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete inventory. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingInventoryId(null);
  };

  const applyFilters = () => {
    let filtered = allInventories;
    if (filterByCategory !== null) {
      filtered = filtered.filter(
        (inventory) => inventory.product?.categoryId === filterByCategory
      );
    }
    if (filterProduct !== null) {
      filtered = filtered.filter(
        (inventory) => inventory.productId === filterProduct
      );
    }
    if (filterLocation !== null) {
      filtered = filtered.filter(
        (inventory) => inventory.locationId === filterLocation
      );
    }
    setFilteredInventories(filtered);
  };

  const handleTransfer = async () => {
    setIsCreated(!isCreated);
  };
  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const handleSelectTransfer = async (inventory: InventoryProps) => {
    if (inventory) {
      setIsOpen(true);
      setSelectedInventory(inventory);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterByCategory || ""}
            onChange={(e) =>
              setFilterByCategory(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="border p-2 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-800"
          >
            <option value="">Filter by Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filterProduct || ""}
            onChange={(e) =>
              setFilterProduct(e.target.value ? parseInt(e.target.value) : null)
            }
            className="border p-2 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-800"
          >
            <option value="">Filter by Product</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name}
              </option>
            ))}
          </select>

          <select
            value={filterLocation || ""}
            onChange={(e) =>
              setFilterLocation(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="border p-2 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-800"
          >
            <option value="">Filter by Location</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
        </div>

        {/* Create Inventory Modal */}
        <Modal
          title="Create Inventory"
          description="Add inventory details"
          triggerText="Create Inventory"
          cancelText="Cancel"
          open={isCreateOpen}
          setOpen={setIsCreateOpen}
          style="border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white"
          formComponent={
            <InventoryForm
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              products={products}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error

              locations={locations}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              categories={categories}
              onSubmitSuccess={handleCreate}
              setOpen={setIsCreateOpen}
            />
          }
        />
      </div>

      {/* Table */}
      <Table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
          A list of Inventories.
        </TableCaption>
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Product Name
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Location
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Quantity
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Other Location Stock
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Total Stock
            </TableHead>
            <TableHead className="text-right text-gray-800 dark:text-gray-100">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventories.map((inventory) => (
            <TableRow
              key={inventory.inventoryId}
              className="hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <TableCell className="flex text-gray-700 dark:text-gray-300 font-medium space-x-4 text-nowrap">
                <span>
                  {products.find(
                    (product) => product.productId === inventory.productId
                  )?.category?.name || "No Category"}
                </span>
                <div className="border-r-2 border-r-white" />
                <span>{inventory.product?.name}</span>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300 text-nowrap">
                {locations.find(
                  (loc) => loc.locationId === inventory.locationId
                )?.locationName || "Unknown location"}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {editingInventoryId === inventory.inventoryId ? (
                  <input
                    type="number"
                    value={updatedInventory?.quantity || 0}
                    onChange={(e) => handleChange(e, "quantity")}
                    className="border p-1 rounded-md"
                  />
                ) : (
                  inventory.quantity
                )}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {allInventories
                  .filter((inv) => inv.productId === inventory.productId)
                  .reduce((sum, inv) => sum + inv.quantity, 0) -
                  inventory.quantity}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {allInventories
                  .filter((inv) => inv.productId === inventory.productId)
                  .reduce((sum, inv) => sum + inv.quantity, 0)}
              </TableCell>
              <TableCell className="flex justify-end space-x-2 text-gray-700 dark:text-gray-300">
                {editingInventoryId === inventory.inventoryId ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleUpdate}
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="ml-2 border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(inventory)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                    >
                      Edit
                    </Button>
                    {/* <AlertDialogComponent
                      inventoryId={inventory.inventoryId as number}
                      triggerLabel="Delete"
                      title="Are you sure you want to delete this inventory?"
                      description="This action cannot be undone."
                      cancelLabel="Cancel"
                      actionLabel="Delete"
                      onAction={handleDelete}
                      style="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white"
                    /> */}
                    <Button
                      variant="outline"
                      onClick={() => handleSelectTransfer(inventory)}
                      className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-white"
                    >
                      Transfer
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isOpen && (
        <Modal
          title="Transfer Inventory"
          description="Transfer inventory stock"
          triggerText="Transfer"
          cancelText="Cancel"
          open={isOpen}
          setOpen={setIsOpen}
          formComponent={
            <StockTransferForm
              product={products.find(
                (product) => product.productId === selectedInventory?.productId
              )}
              locations={locations}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              inventory={selectedInventory} // Pass the specific inventory here
              onSubmitSuccess={handleTransfer}
              setOpen={setIsOpen}
            />
          }
        />
      )}
    </div>
  );
};

export default InventoryTable;
