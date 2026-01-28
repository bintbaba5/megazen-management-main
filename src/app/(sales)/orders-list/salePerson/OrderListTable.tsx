// "use client";
// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { SalesOrder } from "../generalTypes";
// import Loader from "@/common/Loader";
// import { toast } from "@/hooks/use-toast";
// import { ToastAction } from "@/components/ui/toast";

// const SalesOrderListTable = () => {
//   const [editSalesOrder, setEditSalesOrder] = useState<any>(null);
//   const [deleteSalesOrder, setDeleteSalesOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [salesOrders, setOrders] = useState<SalesOrder[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("All");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isLineItemsEditable, setIsLineItemsEditable] = useState(false);


//   useEffect(() => {
//     fetchSalesOrders();
//   }, []);

//   const filteredOrders = salesOrders.filter((salesOrder) => {
//     const matchesCustomer = (salesOrder.customer?.name || "Customer X")
//     .toLowerCase()
//     .includes(searchTerm.toLowerCase());
//     const matchesPaymentStatus =
//       paymentStatus === "All" || salesOrder.paymentStatus === paymentStatus;
//     const matchesDateRange =
//       (!startDate ||
//         new Date(salesOrder.orderDate) >= new Date(startDate)) &&
//       (!endDate || new Date(salesOrder.orderDate) <= new Date(endDate));

//     return matchesCustomer && matchesPaymentStatus && matchesDateRange;
//     // return  matchesPaymentStatus && matchesDateRange;
//   });

//   const calculateRemainingAmount = (totalAmount: number, payedAmount: number) => {
//     return totalAmount - payedAmount;
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: string
//   ) => {
//     setEditSalesOrder((prev) => {
//       if (field === "customerName") {
//         return {
//           ...prev,
//           customer: prev?.customer
//             ? { ...prev.customer, name: e.target.value } // Update existing customer
//             : { name: e.target.value }, // Create new customer object if null
//         };
//       }
  
//       return {
//         ...prev,
//         [field]:
//           e.target.type === "number"
//             ? Number(e.target.value) // Convert number fields
//             : e.target.value, // Handle other fields
//       };
//     });
//   };

//   const handleLineItemChange = (
//     index: number,
//     field: string,
//     value: string | number
//   ) => {
//     const updatedLineItems = [...editSalesOrder.salesOrderLineItems];
//     updatedLineItems[index][field] = value;

//     if (field === "quantity" || field === "unitPrice") {
//       updatedLineItems[index].totalPrice =
//         updatedLineItems[index].quantity * updatedLineItems[index].unitPrice;
//     }

//     setEditSalesOrder({
//       ...editSalesOrder,
//       salesOrderLineItems: updatedLineItems,
//       totalAmount: updatedLineItems.reduce(
//         (total, item) => total + item.totalPrice,
//         0
//       ),
//     });
//   };

//   const handleRemoveLineItem = (index: number) => {
//     const updatedLineItems = [...editSalesOrder.salesOrderLineItems];
//     updatedLineItems[index].deleted = true;

//     const visibleLineItems = updatedLineItems.filter((item) => !item.deleted);

//     setEditSalesOrder({
//       ...editSalesOrder,
//       salesOrderLineItems: updatedLineItems,
//       totalAmount: visibleLineItems.reduce(
//         (total, item) => total + item.totalPrice,
//         0
//       ),
//     });
//   };

//   const handleEditSalesOrder = (salesOrder: any) => {
//     const formattedSalesOrder = {
//       saleId: salesOrder.saleId,
//       customer: salesOrder.customer
//       ? { name: salesOrder.customer.name || "Customer X", id: salesOrder.customer.customerId || null }
//       : { name: "Customer X", id: null },
//       totalAmount: salesOrder.totalAmount,
//       payedAmount: parseFloat(salesOrder.payedAmount),
//       orderDate: salesOrder.orderDate,
//       dueDate: new Date().toISOString(),
//       salesOrderLineItems: salesOrder.SalesOrderLineItems.map((item: any) => ({
//         id: item.id,
//         productId: item.productId,
//         productName: item.product.name,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice,
//         totalPrice: item.totalPrice,
//         deleted: item.deleted || false,
//       })),
//     };
//     setEditSalesOrder(formattedSalesOrder);
//   };

//   const fetchSalesOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/sale/order");
//       if (!response.ok) throw new Error("Failed to fetch sales orders");
//       const data = await response.json();
//       setOrders(data.data);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: error.message,
//         action: <ToastAction altText="Try again">Try again</ToastAction>,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateSalesOrder = async () => {
//     setLoading(true);

//     try {
//       const res = await fetch(`/api/sale/payment/${editSalesOrder.saleId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editSalesOrder),
//       });

//       if (!res.ok) throw new Error("Failed to update sales order");

//       await fetchSalesOrders();
//       toast({
//         variant: "default",
//         title: "Success!",
//         description: "Sales Order updated successfully.",
//         action: <ToastAction altText="Close">Close</ToastAction>,
//       });

//       setEditSalesOrder(null);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to update sales order. Error: ${error.message}`,
//         action: <ToastAction altText="Close">Close</ToastAction>,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSalesOrder = async () => {
//     if (!deleteSalesOrder) return;

//     setLoading(true);

//     try {
//       const res = await fetch(`/api/sale/payment/${deleteSalesOrder.saleId}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete sales order");

//       await fetchSalesOrders();
//       toast({
//         variant: "default",
//         title: "Success!",
//         description: "Sales Order deleted successfully.",
//         action: <ToastAction altText="Close">Close</ToastAction>,
//       });

//       setDeleteSalesOrder(null);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to delete sales order. Error: ${error.message}`,
//         action: <ToastAction altText="Try again">Try again</ToastAction>,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 rounded-lg shadow-md">
//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         {/* Search and Filters */}
//         <div className="w-full">
//           <input
//             type="text"
//             placeholder="Search by Customer"
//             className="w-full px-4 py-2 border rounded-md"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Filter by Payment Status */}
//         <div className="w-full">
//           <select
//             className="w-full px-4 py-2 border rounded-md"
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value)}
//           >
//             <option value="All">All</option>
//             <option value="Paid">Paid</option>
//             <option value="Partial">Partial</option>
//             <option value="Unpaid">Unpaid</option>
//           </select>
//         </div>

//         {/* Filter by Date */}
//         <div className="w-full">
//           <div className="flex gap-2">
//             <input
//               type="date"
//               className="px-4 py-2 border rounded-md w-full"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <input
//               type="date"
//               className="px-4 py-2 border rounded-md w-full"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="overflow-x-auto md:overflow-x-auto">
//   <Table>
//     <TableHeader>
//       <TableRow>
//         <TableHead>ID</TableHead>
//         <TableHead>Order Date</TableHead>
//         <TableHead className="min-w-[120px]">Customer Name</TableHead>
//         <TableHead>Total Amount (ብር)</TableHead>
//         <TableHead>Paid Amount (ብር)</TableHead>
//         <TableHead>Remaining Amount (ብር)</TableHead>
//         <TableHead>Payment Status</TableHead>
//         <TableHead>Status</TableHead>
//         <TableHead className="min-w-[300px]">Line Items</TableHead> {/* Increased width for Line Items */}
//         <TableHead>Actions</TableHead>
//       </TableRow>
//     </TableHeader>
//     <TableBody>
//       {filteredOrders.length > 0 ? (
//         filteredOrders.map((salesOrder) => (
//           <TableRow key={salesOrder.saleId}>
//             <TableCell>{salesOrder.saleId}</TableCell>
//             <TableCell>{new Date(salesOrder.orderDate).toLocaleDateString()}</TableCell>
//             <TableCell>{salesOrder.customer ? salesOrder.customer.name : "Customer X"}</TableCell>
//             <TableCell>{salesOrder.totalAmount} ብር</TableCell>
//             <TableCell>{salesOrder.payedAmount} ብር</TableCell>
//             <TableCell>{calculateRemainingAmount(salesOrder.totalAmount, salesOrder.payedAmount)} ብር</TableCell>
//             <TableCell>
//               <span
//                 className={`px-2 py-1 text-sm font-medium rounded ${
//                   salesOrder.paymentStatus === 'Paid'
//                     ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
//                     : salesOrder.paymentStatus === 'Partial'
//                     ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
//                     : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
//                 }`}
//               >
//                 {salesOrder.paymentStatus}
//               </span>
//             </TableCell>
//             <TableCell>{salesOrder.status}</TableCell>
//             <TableCell>
//               <div className="flex flex-col gap-2">
//                 {salesOrder.SalesOrderLineItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between border-b gap-2 border-gray-300 pb-2"
//                   >
//                     <span className="flex-1">{item.product.name}</span>
//                     <span className="flex-shrink-0"><strong>Qty:</strong> {item.quantity}</span>
//                     <span className="flex-shrink-0"><strong>T.Price:</strong> {item.totalPrice} ብር</span>
//                   </div>
//                 ))}
//               </div>
//             </TableCell>
//             <TableCell>
//               <div className="flex flex-col sm:flex-row sm:gap-2">
//                 <Button
//                   onClick={() => handleEditSalesOrder(salesOrder)}
//                   variant="outline"
//                   className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => setDeleteSalesOrder(salesOrder)}
//                   className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         ))
//       ) : (
//         <TableRow>
//           <TableCell colSpan="10" className="text-center py-4">No matching orders found</TableCell>
//         </TableRow>
//       )}
//     </TableBody>
//   </Table>
// </div>

// {/* Edit Sale Order Dialog */}
// {editSalesOrder && (
//   <Dialog open={!!editSalesOrder} onOpenChange={() => setEditSalesOrder(null)}>
//     <DialogContent className="max-w-3xl overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle>Edit Sale Order</DialogTitle>
//       </DialogHeader>
//       <div className="grid gap-4">
//         {/* Customer Information */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium">Customer Name</label>
//           <Input
//             placeholder="Customer Name"
//             value={editSalesOrder?.customer?.name || ""} // Ensure fallback to empty string
//             onChange={(e) => handleInputChange(e, "customerName")}
//             className="w-full"
//             disabled 
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm font-medium">Order Date</label>
//           <Input
//             type="date"
//             placeholder="Order Date"
//             value={editSalesOrder.orderDate ? new Date(editSalesOrder.orderDate).toISOString().split("T")[0] : ""}
//             onChange={(e) => handleInputChange(e, "orderDate")}
//             className="w-full"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm font-medium">Total Amount</label>
//           <Input
//             type="number"
//             placeholder="Total Amount"
//             value={editSalesOrder.totalAmount}
//             disabled
//             className="w-full"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm font-medium">Paid Amount</label>
//           <Input
//             type="number"
//             placeholder="Paid Amount"
//             value={editSalesOrder.payedAmount}
//             onChange={(e) => handleInputChange(e, "payedAmount")}
//             className="w-full"
//           />
//         </div>

//         {/* Line Items */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="text-lg font-semibold">Line Items</h4>
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={isLineItemsEditable}
//                 onChange={() => setIsLineItemsEditable(!isLineItemsEditable)}
//               />
//               <label className="text-sm font-medium">Enable Editing for All</label>
//             </div>
//           </div>
//           <div className="space-y-4">
//             {editSalesOrder.salesOrderLineItems
//               .filter((item) => !item.deleted) // Filter out deleted items
//               .map((item, index) => (
//                 <div key={index} className="flex flex-wrap items-center gap-4">
//                   {/* Product Name */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium">Product Name</label>
//                     <Input
//                       placeholder="Product Name"
//                       value={item.productName} // Display product name
//                       disabled
//                       className="w-32"
//                     />
//                   </div>

//                   {/* Quantity */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium">Quantity</label>
//                     <Input
//                       type="number"
//                       placeholder="Quantity"
//                       value={item.quantity}
//                       disabled={!isLineItemsEditable}
//                       onChange={(e) => handleLineItemChange(index, "quantity", Number(e.target.value))}
//                       className="w-24"
//                     />
//                   </div>

//                   {/* Unit Price */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium">Unit Price</label>
//                     <Input
//                       type="number"
//                       placeholder="Unit Price"
//                       value={item.unitPrice}
//                       disabled={!isLineItemsEditable}
//                       onChange={(e) => handleLineItemChange(index, "unitPrice", Number(e.target.value))}
//                       className="w-28"
//                     />
//                   </div>

//                   {/* Total Price */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium">Total Price</label>
//                     <Input
//                       type="number"
//                       placeholder="Total Price"
//                       value={item.totalPrice}
//                       disabled
//                       className="w-32"
//                     />
//                   </div>

//                   {/* Remove Button */}
//                   <div className="flex flex-col justify-end">
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleRemoveLineItem(index)}
//                       disabled={editSalesOrder.salesOrderLineItems.filter((item) => !item.deleted).length === 1} // Disable if only one line item remains
//                       className="mt-auto"
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>

//       {/* Dialog Footer */}
//       <DialogFooter>
//         <div className="flex gap-4 w-full">
//           <Button
//             onClick={() => setEditSalesOrder(null)}
//             disabled={loading}
//             variant="outline"
//               className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpdateSalesOrder}
//             disabled={loading}
//             variant="outline"
//             className=" mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
        
          
//           >
//             Update
//           </Button>
//         </div>
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>
// )}

// {/* Delete Sale Order Dialog */}
// {deleteSalesOrder && (
//   <Dialog open={!!deleteSalesOrder} onOpenChange={() => setDeleteSalesOrder(null)}>
//     <DialogContent className="max-w-md">
//       <DialogHeader>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//       </DialogHeader>
//       <p>Are you sure you want to delete the sale order {deleteSalesOrder.saleId}?</p>
//       <DialogFooter>
//         <div className="flex gap-4 w-full">
//           <Button
//             onClick={() => setDeleteSalesOrder(null)}
//             disabled={loading}
//             variant="outline"
//             className=" mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
        
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteSalesOrder}
//             disabled={loading}
//            variant="destructive"
//               className="text-white-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
//           >
//             Delete
//           </Button>
//         </div>
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>
// )}

//     </div>
//   );
// };

// export default SalesOrderListTable;

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
import { Input } from "@/components/ui/input";
import { SalesOrder } from "../generalTypes";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { EditSalesOrderDialog } from "../components/EditSalesOrderDialog";
import { EditPaymentDialog } from "../components/EditPaymentDialog";
import { DeleteDialog } from "../components/DeleteDialog";

const SalesOrderListTable = () => {
  const [editSalesOrder, setEditSalesOrder] = useState<SalesOrder | null>(null);
  const [editPayment, setEditPayment] = useState<SalesOrder | null>(null);
  const [deleteSalesOrder, setDeleteSalesOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [salesOrders, setOrders] = useState<SalesOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLineItemsEditable, setIsLineItemsEditable] = useState(false);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sale/order");
      if (!response.ok) throw new Error("Failed to fetch sales orders");
      const data = await response.json();
      setOrders(data.data);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = salesOrders.filter((salesOrder) => {
    const matchesCustomer = (salesOrder.customer?.name || "Customer X")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPaymentStatus =
      paymentStatus === "All" || salesOrder.paymentStatus === paymentStatus;
    const matchesDateRange =
      (!startDate || new Date(salesOrder.orderDate) >= new Date(startDate)) &&
      (!endDate || new Date(salesOrder.orderDate) <= new Date(endDate));

    return matchesCustomer && matchesPaymentStatus && matchesDateRange;
  });

  const handleEditSalesOrder = (salesOrder: SalesOrder) => {
    const formattedSalesOrder: SalesOrder = {
      ...salesOrder,
      customer: salesOrder.customer || { name: "Customer X" },
      salesOrderLineItems: salesOrder.SalesOrderLineItems.map((item) => ({
        ...item,
        deleted: item.deleted || false,
      })),
    };
    setEditSalesOrder(formattedSalesOrder);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditSalesOrder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
      };
    });
  };

  const handleLineItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setEditSalesOrder((prev) => {
      if (!prev) return null;
      const updatedLineItems = [...prev.salesOrderLineItems];
      updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };

      if (field === "quantity" || field === "unitPrice") {
        updatedLineItems[index].totalPrice =
          updatedLineItems[index].quantity * updatedLineItems[index].unitPrice;
      }

      return {
        ...prev,
        salesOrderLineItems: updatedLineItems,
        totalAmount: updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    });
  };

  const handleRemoveLineItem = (index: number) => {
    setEditSalesOrder((prev) => {
      if (!prev) return null;
      const updatedLineItems = [...prev.salesOrderLineItems];
      updatedLineItems[index].deleted = true;
      
      return {
        ...prev,
        salesOrderLineItems: updatedLineItems,
        totalAmount: updatedLineItems
          .filter((item) => !item.deleted)
          .reduce((sum, item) => sum + item.totalPrice, 0),
      };
    });
  };

  const handleUpdateSalesOrder = async () => {
    if (!editSalesOrder) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sale/order/${editSalesOrder.saleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSalesOrder),
      });

      if (!res.ok) throw new Error("Failed to update sales order");
      await fetchSalesOrders();
      showSuccessToast("Sales Order updated successfully");
      setEditSalesOrder(null);
    } catch (error) {
      showErrorToast(`Failed to update sales order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (value: number, status: string) => {
    setEditPayment(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        payedAmount: value,
        paymentStatus: status
      }
    });
  };
  
  const handleUpdatePayment = async () => {
    if (!editPayment) return; 
  
    setLoading(true);
    try {
      console.log( "payedAmount:", editPayment.payedAmount,
        "paymentStatus:", editPayment.paymentStatus,  // Pass the selected payment status
        "saleId:", editPayment.saleId,  // Make sure saleId is 
        );
        const res = await fetch(`/api/sale/payment/${editPayment.saleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payedAmount: editPayment.payedAmount,
            paymentStatus: editPayment.paymentStatus,
            saleId: editPayment.saleId
          }),
      });
  
      if (!res.ok) throw new Error("Failed to update payment");
      await fetchSalesOrders();
      showSuccessToast("Payment updated successfully");
      setEditPayment(null);
    } catch (error) {
      showErrorToast(`Failed to update payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSalesOrder = async () => {
    if (!deleteSalesOrder) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sale/payment/${deleteSalesOrder.saleId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete sales order");
      await fetchSalesOrders();
      showSuccessToast("Sales Order deleted successfully");
      setDeleteSalesOrder(null);
    } catch (error) {
      showErrorToast(`Failed to delete sales order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showErrorToast = (message: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  const showSuccessToast = (message: string) => {
    toast({
      variant: "default",
      title: "Success",
      description: message,
      action: <ToastAction altText="Close">Close</ToastAction>,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 rounded-lg shadow-md">
      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search by Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded-md p-2"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <div className="flex gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto md:overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="min-w-[120px]">Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead  className="min-w-[300px]"> Ordered Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.saleId}>
                <TableCell>{order.saleId}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.customer?.name || "Customer X"}</TableCell>
                <TableCell>{order.totalAmount} ብር</TableCell>
                <TableCell>{order.payedAmount} ብር</TableCell>
                <TableCell>
                  {order.totalAmount - order.payedAmount} ብር
                </TableCell>
                <TableCell>
                <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                          : order.paymentStatus === "Partial"
                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                          : order.paymentStatus === "Unpaid"
                          ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                          :"bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-2">
                      {order?.SalesOrderLineItems?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between border-b gap-2 border-gray-300 pb-2"
                        >
                          <span className="flex-1">{item.product.name}</span>
                          <span className="flex-shrink-0">
                            <strong>Qty:</strong> {item.quantity}
                          </span>
                          <span className="flex-shrink-0">
                            <strong>T.Price:</strong> {item.totalPrice} ብር
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    
                  {order.paymentStatus === "Pending" && (
                      <Button
                        variant="outline"
                        className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
                        onClick={() => handleEditSalesOrder(order)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-500 w-full sm:w-auto"
                   
                      onClick={() => setEditPayment(order)}
                    >
                      Payment
                    </Button>
                    <Button
                       className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
                      variant="outline"
                      onClick={() => setDeleteSalesOrder(order)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Components */}
      <EditSalesOrderDialog
        open={!!editSalesOrder}
        salesOrder={editSalesOrder}
        loading={loading}
        onClose={() => setEditSalesOrder(null)}
        onInputChange={handleInputChange}
        onLineItemChange={handleLineItemChange}
        onRemoveLineItem={handleRemoveLineItem}
        onUpdate={handleUpdateSalesOrder}
        isLineItemsEditable={isLineItemsEditable}
        setIsLineItemsEditable={setIsLineItemsEditable}
      />

      <EditPaymentDialog
        open={!!editPayment}
        salesOrder={editPayment}
        loading={loading}
        onClose={() => setEditPayment(null)}
        onPaymentChange={handlePaymentChange}
        onUpdate={handleUpdatePayment}
      />

      <DeleteDialog
        open={!!deleteSalesOrder}
        salesOrder={deleteSalesOrder}
        loading={loading}
        onClose={() => setDeleteSalesOrder(null)}
        onConfirm={handleDeleteSalesOrder}
      />
    </div>
  );
};

export default SalesOrderListTable;