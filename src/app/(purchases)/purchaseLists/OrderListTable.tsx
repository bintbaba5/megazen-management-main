"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PurchaseOrder } from "../generalTypes";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const OrderListTable = () => {
  const [editPurchaseOrder, setEditPurchaseOrder] = useState<any>(null);
  const [deletePurchaseOrder, setDeletePurchaseOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseOrders, setOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Fetch purchase orders on mount
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Filtering function
  const filteredOrders = purchaseOrders.filter((purchaseOrder) => {
  // const matchesSupplier = purchaseOrder.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesSupplier = purchaseOrder.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())|| "Supplier X";
  const matchesPaymentStatus = paymentStatus === 'All' || purchaseOrder.paymentStatus === paymentStatus;
  const matchesDateRange =
    (!startDate || new Date(purchaseOrder.orderDate) >= new Date(startDate)) &&
      (!endDate || new Date(purchaseOrder.orderDate) <= new Date(endDate));

     return matchesSupplier && matchesPaymentStatus && matchesDateRange;
    //return  matchesPaymentStatus && matchesDateRange;
  });

  // Calculate remaining amount
  const calculateRemainingAmount = (
    totalAmount: number,
    paidAmount: number
  ) => {
    return totalAmount - paidAmount;
  };

  // // Handle input changes for purchase order fields
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
  //   setEditPurchaseOrder({ ...editPurchaseOrder, [field]: e.target.value });
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {

    setEditPurchaseOrder((prev) => {
      if (field === "supplierName") {
        return {
          ...prev,
          supplier: prev?.supplier
            ? { ...prev.supplier, name: e.target.value } // Update existing supplier
            : { name: e.target.value }, // Create new supplier object if null
        };
      }
  
      return {
        ...prev,
        [field]:
          e.target.type === "number"
            ? Number(e.target.value) // Convert number fields
            : e.target.value, // Handle other fields
      };
    });
  };


  // Handle line item changes (for quantity and price)
  const handleLineItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedLineItems = [...editPurchaseOrder.purchaseOrderLineItems];
    updatedLineItems[index][field] = value;

    // Recalculate total price for the line item
    if (field === "quantity" || field === "unitPrice") {
      updatedLineItems[index].totalPrice =
        updatedLineItems[index].quantity * updatedLineItems[index].unitPrice;
    }

    setEditPurchaseOrder({
      ...editPurchaseOrder,
      purchaseOrderLineItems: updatedLineItems,
      totalAmount: updatedLineItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      ), // Update total amount dynamically
    });
  };

  // Remove a line item from the purchase order
  const handleRemoveLineItem = (index: number) => {
    const updatedLineItems = [...editPurchaseOrder.purchaseOrderLineItems];

    // Mark the line item as deleted
    updatedLineItems[index].deleted = true;

    // Filter out the deleted items for rendering
    const visibleLineItems = updatedLineItems.filter((item) => !item.deleted);

    setEditPurchaseOrder({
      ...editPurchaseOrder,
      purchaseOrderLineItems: updatedLineItems,
      totalAmount: visibleLineItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      ), // Recalculate total amount
    });
  };

  const handleEditPurchaseOrder = (purchaseOrder: any) => {
    const formattedPurchaseOrder = {
      purchaseId: purchaseOrder.purchaseId,  // Ensure 'purchaseId' here
       supplier: purchaseOrder.supplier
      ? { name: purchaseOrder.supplier.name || "supplier X", id: purchaseOrder.supplier.supplierId || null }
      : { name: "supplier X", id: null },

      totalAmount: purchaseOrder.totalAmount,
      paidAmount: parseFloat(purchaseOrder.paidAmount),
      orderDate: purchaseOrder.orderDate,
      expectedDeliveryDate: new Date().toISOString(),
      locationId: purchaseOrder.locationId,
      purchaseOrderLineItems: purchaseOrder.PurchaseOrderLineItems.map(
        (item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          deleted: item.deleted || false,
        })
      ),
    };
    setEditPurchaseOrder(formattedPurchaseOrder);
  };

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/purchase/order");
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
      const data = await response.json();
      setOrders(data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePurchaseOrder = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/purchase/order/${editPurchaseOrder.purchaseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPurchaseOrder),
      });

      if (!res.ok) {
        const error = new Error("Failed to update purchase order");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }

      // alert("Purchase Order updated successfully.");
      await fetchPurchaseOrders(); // Re-fetch data after update
      toast({
        variant: "default",
        title: "Success!",
        description: "Your update was successful.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });

      setEditPurchaseOrder(null); // Close the modal
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to update purchase order. Error: ${error.message}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePurchaseOrder = async () => {
    if (!deletePurchaseOrder) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/purchase/order/${deletePurchaseOrder.purchaseId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const error = new Error("Failed to delete purchase order");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      await fetchPurchaseOrders(); // Re-fetch data after update
      toast({
        variant: "default",
        title: "Success!",
        description: "Purchase Order deleted successfully.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });

      setDeletePurchaseOrder(null); // Optionally reset the purchase order selection
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to delete purchase order. Error: ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
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
    <div className="p-6 rounded-lg shadow-md">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Search by Supplier */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search by Supplier"
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Payment Status */}
        <div className="w-full">
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Filter by Date */}
        <div className="w-full">
          <div className="flex gap-2">
            <input
              type="date"
              className="px-4 py-2 border rounded-md w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-2 border rounded-md w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto md:overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead className="min-w-[120px]">Supplier Name</TableHead>
              <TableHead>Total Amount (ብር)</TableHead>
              <TableHead>Paid Amount (ብር)</TableHead>
              <TableHead>Remaining Amount (ብር)</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[300px]">Line Items</TableHead>{" "}
              {/* Increased width for Line Items */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((purchaseOrder) => (
                <TableRow key={purchaseOrder.purchaseId}>
                  <TableCell>{purchaseOrder.purchaseId}</TableCell>
                  <TableCell>{new Date(purchaseOrder.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{purchaseOrder.supplier ? purchaseOrder.supplier.name : "supplier X"}</TableCell>
                  <TableCell>{purchaseOrder.totalAmount} ብር</TableCell>
                  <TableCell>{purchaseOrder.paidAmount} ብር</TableCell>
                  <TableCell>
                    {calculateRemainingAmount(
                      purchaseOrder.totalAmount,
                      purchaseOrder.paidAmount
                    )}{" "}
                    ብር
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        purchaseOrder.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                          : purchaseOrder.paymentStatus === "Partial"
                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                          : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                      }`}
                    >
                      {purchaseOrder.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>{purchaseOrder.status}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {purchaseOrder.PurchaseOrderLineItems.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex justify-between border-b gap-1 border-gray-300 pb-2"
                          >
                            <span className="flex-1">{item.product.name}</span>
                            <span className="flex-shrink-0">
                              <strong>Qty:</strong> {item.quantity}
                            </span>
                            <span className="flex-shrink-0">
                              <strong>Total Price:</strong> {item.totalPrice} ብር
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {purchaseOrder.status !== "Completed" ? (
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <Button
                          onClick={() => handleEditPurchaseOrder(purchaseOrder)}
                          variant="outline"
                          className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDeletePurchaseOrder(purchaseOrder)}
                          className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Not Editable/Deletable
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="10" className="text-center py-4">
                  No matching orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Purchase Order Dialog */}
      {editPurchaseOrder && (
        <Dialog
          open={!!editPurchaseOrder}
          onOpenChange={() => setEditPurchaseOrder(null)}
        >
          <DialogContent className="max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {/* Vendor Information */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Vendor Name</label>
                <Input
                  placeholder="Vendor Name"
                  value={editPurchaseOrder.supplierName}
                  onChange={(e) => handleInputChange(e, "supplierName")}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">
                  Expected Delivery Date
                </label>
                <Input
                  type="date"
                  value={
                    editPurchaseOrder.expectedDeliveryDate
                      ? new Date(editPurchaseOrder.expectedDeliveryDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleInputChange(e, "expectedDeliveryDate")}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Total Amount</label>
                <Input
                  type="number"
                  value={editPurchaseOrder.totalAmount}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Paid Amount</label>
                <Input
                  type="number"
                  value={editPurchaseOrder.paidAmount}
                  onChange={(e) => handleInputChange(e, "paidAmount")}
                  className="w-full"
                />
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Line Items</h4>
                <div className="space-y-4">
                  {editPurchaseOrder.purchaseOrderLineItems
                    .filter((item) => !item.deleted) // Filter out deleted items
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-4"
                      >
                        {/* Product Name */}
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">
                            Product Name
                          </label>
                          <Input
                            placeholder="Product Name"
                            value={item.productName} // Display product name
                            disabled
                            className="w-32"
                          />
                        </div>

{/* Edit Purchase Order Dialog */}
{editPurchaseOrder && (
  <Dialog open={!!editPurchaseOrder} onOpenChange={() => setEditPurchaseOrder(null)}>
    <DialogContent className="max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Purchase Order</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        {/* Vendor Information */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Supplier Name</label>
          <Input
            placeholder="Supplier Name"
            value={editPurchaseOrder?.supplier?.name || ""} 
            onChange={(e) => handleInputChange(e, "supplierName")}
            className="w-full"
            disabled 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Total Amount</label>
          <Input
            type="number"
            value={editPurchaseOrder.totalAmount}
            disabled
            className="w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Paid Amount</label>
          <Input
            type="number"
            value={editPurchaseOrder.paidAmount}
            onChange={(e) => handleInputChange(e, "paidAmount")}
            className="w-full"
          />
        </div>

        {/* Line Items */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Line Items</h4>
          <div className="space-y-4">
            {editPurchaseOrder.purchaseOrderLineItems
              .filter((item) => !item.deleted) 
              .map((item, index) => (
                <div key={index} className="flex flex-wrap items-center gap-4">
                  {/* Product Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                      placeholder="Product Name"
                      value={item.productName} 
                      disabled
                      className="w-32"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, "quantity", Number(e.target.value))}
                      className="w-24"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(index, "unitPrice", Number(e.target.value))}
                      className="w-28"
                    />
                  </div>

                  {/* Total Price */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Total Price</label>
                    <Input
                      type="number"
                      value={item.totalPrice}
                      disabled
                      className="w-32"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveLineItem(index)}
                      disabled={editPurchaseOrder.purchaseOrderLineItems.filter((item) => !item.deleted).length === 1} // Disable if only one line item remains
                      className="mt-auto"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Dialog Footer */}
      <DialogFooter>
        <div className="flex gap-4 w-full">
          <Button
            onClick={() => setEditPurchaseOrder(null)}
            disabled={loading}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePurchaseOrder}
            disabled={loading}
            variant="outline"
            className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
          >
            Update
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

{/* Delete Purchase Order Dialog */}
{deletePurchaseOrder && (
  <Dialog open={!!deletePurchaseOrder} onOpenChange={() => setDeletePurchaseOrder(null)}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to delete the purchase order {deletePurchaseOrder.purchaseId}?</p>
      <DialogFooter>
        <div className="flex gap-4 w-full">
          <Button
            onClick={() => setDeletePurchaseOrder(null)}
            disabled={loading}
            variant="outline"
            className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePurchaseOrder}
            disabled={loading}
            variant="destructive"
            className="text-white-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

                        {/* Total Price */}
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">
                            Total Price
                          </label>
                          <Input
                            type="number"
                            value={item.totalPrice}
                            disabled
                            className="w-32"
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="flex flex-col justify-end">
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveLineItem(index)}
                            disabled={
                              editPurchaseOrder.purchaseOrderLineItems.filter(
                                (item) => !item.deleted
                              ).length === 1
                            } // Disable if only one line item remains
                            className="mt-auto"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <DialogFooter>
              <div className="flex gap-4 w-full">
                <Button
                  onClick={() => setEditPurchaseOrder(null)}
                  disabled={loading}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePurchaseOrder}
                  disabled={loading}
                  variant="outline"
                  className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
                >
                  Update
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Purchase Order Dialog */}
      {/* Delete Purchase Order Dialog */}
      {deletePurchaseOrder && (
        <Dialog
          open={!!deletePurchaseOrder}
          onOpenChange={() => setDeletePurchaseOrder(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the purchase order{" "}
              {deletePurchaseOrder.purchaseId}?
            </p>
            <DialogFooter>
              <div className="flex gap-4 w-full">
                <Button
                  onClick={() => setDeletePurchaseOrder(null)}
                  disabled={loading}
                  variant="outline"
                  className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeletePurchaseOrder}
                  disabled={loading}
                  variant="destructive"
                  className="text-white-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
                >
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default OrderListTable;
