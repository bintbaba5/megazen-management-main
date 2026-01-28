// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { SalesOrder } from "../generalTypes";
// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";

// export const EditPaymentDialog = ({
//   open,
//   salesOrder,
//   loading,
//   onClose,
//   onPaymentChange,
//   onUpdate
// }: {
//   open: boolean;
//   salesOrder: SalesOrder | null;
//   loading: boolean;
//   onClose: () => void;
//   onPaymentChange: (value: number) => void;
//   onUpdate: () => void;
// }) => {
//   const [paymentStatus, setPaymentStatus] = useState<string>("");
//   const [paidAmount, setPaidAmount] = useState<number>(0);
//   const totalAmount = salesOrder?.totalAmount || 0;

//   // Initialize state when salesOrder changes
//   useEffect(() => {
//     if (salesOrder) {
//       setPaymentStatus(salesOrder.paymentStatus);
//       setPaidAmount(salesOrder.payedAmount);
//     }
//   }, [salesOrder]);

//   const handleStatusChange = (status: string) => {
//     setPaymentStatus(status);
    
//     switch (status) {
//       case "Unpaid":
//         setPaidAmount(0);
//         onPaymentChange(0);
//         break;
//       case "Paid":
//         setPaidAmount(totalAmount);
//         onPaymentChange(totalAmount);
//         break;
//       case "Partial":
//         // Preserve existing value if valid, otherwise reset to 0
//         const validValue = Math.max(0, Math.min(paidAmount, totalAmount));
//         setPaidAmount(validValue);
//         onPaymentChange(validValue);
//         break;
//     }
//   };

//   const handleAmountChange = (value: number) => {
//     const clampedValue = Math.max(0, Math.min(value, totalAmount));
//     setPaidAmount(clampedValue);
//     onPaymentChange(clampedValue);

//     // Auto-update status based on amount
//     if (clampedValue === 0) {
//       setPaymentStatus("Unpaid");
//     } else if (clampedValue === totalAmount) {
//       setPaymentStatus("Paid");
//     } else {
//       setPaymentStatus("Partial");
//     }
//   };

//   if (!salesOrder) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3">
//             Payment Details
//             <Badge variant="outline" className={
//               paymentStatus === "Paid" ? "border-green-500 text-green-600" :
//               paymentStatus === "Partial" ? "border-yellow-500 text-yellow-600" :
//               "border-red-500 text-red-600"
//             }>
//               {paymentStatus}
//             </Badge>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Total Amount</label>
//             <Input value={totalAmount} disabled className="font-semibold" />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Payment Status</label>
//             <Select value={paymentStatus} onValueChange={handleStatusChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Unpaid">Unpaid</SelectItem>
//                 <SelectItem value="Partial">Partial</SelectItem>
//                 <SelectItem value="Paid">Paid</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Paid Amount</label>
//             <Input
//               type="number"
//               value={paidAmount}
//               onChange={(e) => handleAmountChange(Number(e.target.value))}
//               disabled={paymentStatus === "Unpaid" || paymentStatus === "Paid"}
//               min={0}
//               max={totalAmount}
//               className={paymentStatus === "Partial" ? "bg-white" : "bg-gray-100"}
//             />
//             {paymentStatus === "Partial" && (
//               <p className="text-sm text-muted-foreground">
//                 Enter amount between 0 and {totalAmount}
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Remaining Balance</label>
//             <Input
//               value={totalAmount - paidAmount}
//               disabled
//               className="font-semibold"
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <div className="flex gap-2 w-full flex-col sm:flex-row">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               disabled={loading}
//               className="border-gray-300 hover:bg-gray-50"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="outline"
//               onClick={onUpdate}
//               disabled={loading}
//               className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

//yemiseraw yhe new yhen tetekem 
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { SalesOrder } from "../generalTypes";
// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";

// export const EditPaymentDialog = ({
//   open,
//   salesOrder,
//   loading,
//   onClose,
//   onPaymentChange,
//   onUpdate
// }: {
//   open: boolean;
//   salesOrder: SalesOrder | null;
//   loading: boolean;
//   onClose: () => void;
//   onPaymentChange: (value: number) => void;
//   onUpdate: () => void;
// }) => {
//   const [paymentStatus, setPaymentStatus] = useState<string>("");
//   const [paidAmount, setPaidAmount] = useState<number>(0);
//   const totalAmount = salesOrder?.totalAmount || 0;

//   useEffect(() => {
//     if (salesOrder) {
//       setPaidAmount(salesOrder.payedAmount);
//     }
//   }, [salesOrder]);

//   const handleStatusChange = (status: string) => {
//     setPaymentStatus(status);

//     switch (status) {
//       case "Unpaid":
//         setPaidAmount(0);
//         onPaymentChange(0);
//         break;
//       case "Paid":
//         setPaidAmount(totalAmount);
//         onPaymentChange(totalAmount);
//         break;
//       case "Partial":
//         setPaidAmount(0);
//         onPaymentChange(0);
//         break;
//     }
//   };

//   const handleAmountChange = (value: number) => {
//     const clampedValue = Math.max(0, Math.min(value, totalAmount));
//     setPaidAmount(clampedValue);
//     onPaymentChange(clampedValue);

//     if (clampedValue === 0) {
//       setPaymentStatus("Unpaid");
//     } else if (clampedValue === totalAmount) {
//       setPaymentStatus("Paid");
//     } else {
//       setPaymentStatus("Partial");
//     }
//   };

//   const resetDialog = () => {
//     setPaymentStatus("");
//     setPaidAmount(0);
//   };

//   if (!salesOrder) return null;

//   return (
//     <Dialog open={open} onOpenChange={(isOpen) => {
//       if (!isOpen) {
//         resetDialog();
//         onClose();
//       }
//     }}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3">
//             Payment Details
//             {paymentStatus && (
//               <Badge
//                 variant="outline"
//                 className={
//                   paymentStatus === "Paid" ? "border-green-500 text-green-600" :
//                   paymentStatus === "Partial" ? "border-yellow-500 text-yellow-600" :
//                   "border-red-500 text-red-600"
//                 }
//               >
//                 {paymentStatus}
//               </Badge>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Total Amount</label>
//             <Input value={totalAmount} disabled className="font-semibold" />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Payment Status</label>
//             <Select value={paymentStatus} onValueChange={handleStatusChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Unpaid">Unpaid</SelectItem>
//                 <SelectItem value="Partial">Partial</SelectItem>
//                 <SelectItem value="Paid">Paid</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Paid Amount</label>
//             <Input
//               type="number"
//               value={paidAmount}
//               onChange={(e) => handleAmountChange(Number(e.target.value))}
//               disabled={paymentStatus === "Unpaid" || paymentStatus === "Paid"}
//               min={0}
//               max={totalAmount}
//               className={paymentStatus === "Partial" ? "bg-white" : "bg-gray-100"}
//             />
//             {paymentStatus === "Partial" && (
//               <p className="text-sm text-muted-foreground">
//                 Enter amount between 0 and {totalAmount}
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Remaining Balance</label>
//             <Input value={totalAmount - paidAmount} disabled className="font-semibold" />
//           </div>
//         </div>

//         <DialogFooter>
//           <div className="flex gap-2 w-full flex-col sm:flex-row">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 resetDialog();
//                 onClose();
//               }}
//               disabled={loading}
//               className="border-gray-300 hover:bg-gray-50"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="outline"
//               onClick={onUpdate}
//               disabled={loading}
//               className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalesOrder } from "../generalTypes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export const EditPaymentDialog = ({
  open,
  salesOrder,
  loading,
  onClose,
  onPaymentChange,
  onUpdate
}: {
  open: boolean;
  salesOrder: SalesOrder | null;
  loading: boolean;
  onClose: () => void;
  onPaymentChange: (value: number, status: string) => void;
  onUpdate: () => void;
}) => {
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const totalAmount = salesOrder?.totalAmount || 0;

  useEffect(() => {
    if (salesOrder) {
      setPaidAmount(salesOrder.payedAmount);
    }
  }, [salesOrder]);

  const handleStatusChange = (status: string) => {
    setPaymentStatus(status);
    let newAmount = 0;

    switch (status) {
      case "Unpaid":
        newAmount = 0;
        break;
      case "Paid":
        newAmount = totalAmount;
        break;
      case "Partial":
        newAmount = salesOrder?.payedAmount || 0;
        break;
    }

    setPaidAmount(newAmount);
    onPaymentChange(newAmount, status); // Pass both values
  };

  const handleAmountChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(value, totalAmount));
    setPaidAmount(clampedValue);
    
    let newStatus = "";
    if (clampedValue === 0) {
      newStatus = "Unpaid";
    } else if (clampedValue === totalAmount) {
      newStatus = "Paid";
    } else {
      newStatus = "Partial";
    }
    
    setPaymentStatus(newStatus);
    onPaymentChange(clampedValue, newStatus); // Pass both values
  };

   // Update useEffect to initialize status
   useEffect(() => {
    if (salesOrder) {
      setPaidAmount(salesOrder.payedAmount);
      const initialStatus = salesOrder.paymentStatus || 
        (salesOrder.payedAmount === 0 ? "Unpaid" :
        salesOrder.payedAmount === totalAmount ? "Paid" : "Partial");
      setPaymentStatus(initialStatus);
    }
  }, [salesOrder, totalAmount]);

  const resetDialog = () => {
    setPaymentStatus("");
    setPaidAmount(0);
  };

  if (!salesOrder) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetDialog();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Payment Details
            {paymentStatus && (
              <Badge
                variant="outline"
                className={
                  paymentStatus === "Paid" ? "border-green-500 text-green-600" :
                  paymentStatus === "Partial" ? "border-yellow-500 text-yellow-600" :
                  "border-red-500 text-red-600"
                }
              >
                {paymentStatus}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Amount</label>
            <Input value={totalAmount} disabled className="font-semibold" />
          </div>

          {/* Existing Paid Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Existing Paid Amount</label>
            <Input 
              value={salesOrder.payedAmount} 
              disabled 
              className="font-semibold" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Status</label>
            <Select value={paymentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New Paid Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Paid Amount</label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              disabled={paymentStatus === "Unpaid" || paymentStatus === "Paid"}
              min={0}
              max={totalAmount}
              className={"text-sm font-medium"}
            />
            {paymentStatus === "Partial" && (
              <p className="text-sm text-muted-foreground">
                Enter amount between 0 and {totalAmount}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Remaining Balance</label>
            <Input 
              value={totalAmount - paidAmount} 
              disabled 
              className="font-semibold" 
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                resetDialog();
                onClose();
              }}
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};