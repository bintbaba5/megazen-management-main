// import React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";

// interface EditSalesOrderDialogProps {
//   editSalesOrder: any;
//   setEditSalesOrder: (value: any) => void;
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
//   handleLineItemChange: (index: number, field: string, value: number) => void;
//   handleRemoveLineItem: (index: number) => void;
//   handleUpdateSalesOrder: () => void;
//   loading: boolean;
//   isLineItemsEditable: boolean;
//   setIsLineItemsEditable: (value: boolean) => void;
// }

// const EditSalesOrderDialog: React.FC<EditSalesOrderDialogProps> = ({
//   editSalesOrder,
//   setEditSalesOrder,
//   handleInputChange,
//   handleLineItemChange,
//   handleRemoveLineItem,
//   handleUpdateSalesOrder,
//   loading,
//   isLineItemsEditable,
//   setIsLineItemsEditable,
// }) => {
//   if (!editSalesOrder) return null;

//   return (
//     <Dialog open={!!editSalesOrder} onOpenChange={() => setEditSalesOrder(null)}>
//       <DialogContent className="max-w-3xl overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Sale Order</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4">
//           {/* Customer Information */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">Customer Name</label>
//             <Input
//               placeholder="Customer Name"
//               value={editSalesOrder?.customer?.name || ""}
//               onChange={(e) => handleInputChange(e, "customerName")}
//               className="w-full"
//               disabled
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">Order Date</label>
//             <Input
//               type="date"
//               placeholder="Order Date"
//               value={editSalesOrder.orderDate ? new Date(editSalesOrder.orderDate).toISOString().split("T")[0] : ""}
//               onChange={(e) => handleInputChange(e, "orderDate")}
//               className="w-full"
//               disabled
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">Total Amount</label>
//             <Input type="number" placeholder="Total Amount" value={editSalesOrder.totalAmount} disabled className="w-full" />
//           </div>

//           {/* Line Items */}
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="text-lg font-semibold">Line Items</h4>
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" checked={isLineItemsEditable} onChange={() => setIsLineItemsEditable(!isLineItemsEditable)} />
//                 <label className="text-sm font-medium">Enable Editing for All</label>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {editSalesOrder.salesOrderLineItems
//                 .filter((item) => !item.deleted)
//                 .map((item, index) => (
//                   <div key={index} className="flex flex-wrap items-center gap-4">
//                     {/* Product Name */}
//                     <div className="flex flex-col">
//                       <label className="text-sm font-medium">Product Name</label>
//                       <Input placeholder="Product Name" value={item.productName} disabled className="w-32" />
//                     </div>

//                     {/* Quantity */}
//                     <div className="flex flex-col">
//                       <label className="text-sm font-medium">Quantity</label>
//                       <Input
//                         type="number"
//                         placeholder="Quantity"
//                         value={item.quantity}
//                         disabled={!isLineItemsEditable}
//                         onChange={(e) => handleLineItemChange(index, "quantity", Number(e.target.value))}
//                         className="w-24"
//                       />
//                     </div>

//                     {/* Unit Price */}
//                     <div className="flex flex-col">
//                       <label className="text-sm font-medium">Unit Price</label>
//                       <Input
//                         type="number"
//                         placeholder="Unit Price"
//                         value={item.unitPrice}
//                         disabled={!isLineItemsEditable}
//                         onChange={(e) => handleLineItemChange(index, "unitPrice", Number(e.target.value))}
//                         className="w-28"
//                       />
//                     </div>

//                     {/* Total Price */}
//                     <div className="flex flex-col">
//                       <label className="text-sm font-medium">Total Price</label>
//                       <Input type="number" placeholder="Total Price" value={item.totalPrice} disabled className="w-32" />
//                     </div>

//                     {/* Remove Button */}
//                     <div className="flex flex-col justify-end">
//                       <Button
//                         variant="destructive"
//                         onClick={() => handleRemoveLineItem(index)}
//                         disabled={editSalesOrder.salesOrderLineItems.filter((item) => !item.deleted).length === 1}
//                         className="mt-auto"
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>

//         {/* Dialog Footer */}
//         <DialogFooter>
//           <div className="flex gap-4 w-full">
//             <Button
//               onClick={() => setEditSalesOrder(null)}
//               disabled={loading}
//               variant="outline"
//               className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleUpdateSalesOrder}
//               disabled={loading}
//               variant="outline"
//               className="mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
//             >
//               Update
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditSalesOrderDialog;

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalesOrder } from "../generalTypes";

export const EditSalesOrderDialog = ({
  open,
  salesOrder,
  loading,
  onClose,
  onInputChange,
  onLineItemChange,
  onRemoveLineItem,
  onUpdate,
  isLineItemsEditable,
  setIsLineItemsEditable
}: {
  open: boolean;
  salesOrder: SalesOrder | null;
  loading: boolean;
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  onLineItemChange: (index: number, field: string, value: string | number) => void;
  onRemoveLineItem: (index: number) => void;
  onUpdate: () => void;
  isLineItemsEditable: boolean;
  setIsLineItemsEditable: (value: boolean) => void;
}) => {
  if (!salesOrder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sale Order</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={salesOrder.customer?.name || ""}
                onChange={(e) => onInputChange(e, "customerName")}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Date</label>
              <Input
                type="date"
                value={salesOrder.orderDate.split('T')[0]}
                onChange={(e) => onInputChange(e, "orderDate")}
                disabled
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Amount</label>
            <Input
              value={salesOrder.totalAmount}
              disabled
            />
          </div>

          {/* Line Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Line Items</h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLineItemsEditable}
                  onChange={(e) => setIsLineItemsEditable(e.target.checked)}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Enable Editing</label>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Product</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total Price</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesOrder.salesOrderLineItems
                    .filter(item => !item.deleted)
                    .map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <Input
                            value={item.product.name}
                            disabled
                            className="w-full"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            disabled={!isLineItemsEditable}
                            onChange={(e) => onLineItemChange(index, "quantity", Number(e.target.value))}
                            className="w-full"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            disabled={!isLineItemsEditable}
                            onChange={(e) => onLineItemChange(index, "unitPrice", Number(e.target.value))}
                            className="w-full"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={item.totalPrice}
                            disabled
                            className="w-full"
                          />
                        </td>
                        <td className="p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveLineItem(index)}
                            disabled={salesOrder.salesOrderLineItems.filter(i => !i.deleted).length === 1}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="text-red-600 border-red-600 hover:bg-red-500 w-full sm:w-auto"
           
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={onUpdate}
              disabled={loading}
              className=" mb-2 sm:mb-0 text-blue-600 border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
              >
              {loading ? "Updating..." : "Update Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};