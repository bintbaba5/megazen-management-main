// // components/SalesOrderModal.tsx
// import Modal from "@/components/Modal";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useEffect, useState } from "react";

// type OrderLineItem = {
//   id: number;
//   product: { name: string };
//   purchaseOrder: { supplierName: string };
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
// };

// const PurchaseOrderModal = ({
//   purchaseId,
//   onClose,
// }: {
//   purchaseId: number;
//   onClose: () => void;
// }) => {
//   const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetch(`/api/report/purchases/${purchaseId}`)
//       .then((res) => res.json())
//       .then((data) => setOrderItems(data));
//     setIsLoading(false);
//   }, [purchaseId]);

//   const TableData = () => {
//     return (
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableCell>Product</TableCell>
//             <TableCell>Supplier</TableCell>
//             <TableCell>Quantity</TableCell>
//             <TableCell>Unit Price</TableCell>
//             <TableCell>Total Price</TableCell>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {!isLoading &&
//             orderItems.length &&
//             orderItems.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell>{item.product.name}</TableCell>
//                 <TableCell>{item.purchaseOrder.supplierName}</TableCell>
//                 <TableCell>{item.quantity}</TableCell>
//                 <TableCell>{item.unitPrice}</TableCell>
//                 <TableCell>{item.totalPrice} Br</TableCell>
//               </TableRow>
//             ))}
//           {!isLoading && !orderItems.length && (
//             <TableRow>
//               <TableCell colSpan={5}>No order items found</TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     );
//   };

//   return (
//     <Modal
//       title="Purchase Order Details"
//       open={true}
//       triggerText="View"
//       description="View Purchase Order Details"
//       setOpen={onClose}
//       formComponent={<>{TableData()}</>}
//       cancelText="cancel"
//       key={purchaseId}
//     />
//   );
// };

// export default PurchaseOrderModal;

// components/PurchaseOrderModal.tsx
import Loader from "@/common/Loader";
import Modal from "@/components/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

type OrderLineItem = {
  id: number;
  product: { name: string };
  purchaseOrder: { supplierName: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const PurchaseOrderModal = ({
  purchaseId,
  onClose,
}: {
  purchaseId: number;
  onClose: () => void;
}) => {
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/report/purchases/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchaseId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch purchase order details.");
        }
        const data = await response.json();
        setOrderItems(data);
        toast({
          variant: "default",
          title: "Success!",
          description: "Purchase order details loaded successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to load purchase order details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, [purchaseId]);

  const TableData = () => {
    if (isLoading) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total Price</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.purchaseOrder.supplierName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.totalPrice} Br</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No order items found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <Modal
      title="Purchase Order Details"
      open={true}
      triggerText="View"
      description="View Purchase Order Details"
      setOpen={onClose}
      formComponent={<TableData />}
      cancelText="Cancel"
      key={purchaseId}
    />
  );
};

export default PurchaseOrderModal;
