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
  location: { locationName: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const SalesOrderModal = ({
  saleId,
  onClose,
}: {
  saleId: number;
  onClose: () => void;
}) => {
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/report/sales/details/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ saleId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sales order details.");
        }

        const data = await response.json();
        setOrderItems(data);
        toast({
          variant: "default",
          title: "Success!",
          description: "Sales order details loaded successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sales order details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, [saleId]);

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
            <TableCell>Location</TableCell>
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
                <TableCell>{item.location.locationName}</TableCell>
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
      title="Sales Order Details"
      open={true}
      triggerText="View"
      description="View Sales Order Details"
      setOpen={onClose}
      formComponent={<TableData />}
      cancelText="Cancel"
      key={saleId}
    />
  );
};

export default SalesOrderModal;
