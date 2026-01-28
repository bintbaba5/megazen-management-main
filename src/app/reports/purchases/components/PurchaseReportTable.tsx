import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PurchaseOrderModal from "./PurchaseOrderModal";
import Loader from "@/common/Loader"; // Assuming you have a loader component
import { toast } from "@/hooks/use-toast";
import { PurchasesProps } from "@/global/types";

const PurchaseTable = ({ data }: { data: PurchasesProps[] }) => {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(false);
      toast({
        variant: "default",
        title: "Info",
        description: "No purchases found",
      });
    } else {
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader /> {/* Displaying loader while fetching */}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((purchase) => (
                <TableRow
                  key={purchase.purchaseId}
                  className={
                    purchase.totalAmount - purchase.paidAmount
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  <TableCell>{purchase.supplier.name}</TableCell>
                  <TableCell>
                    {new Date(purchase.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {purchase.totalAmount - purchase.paidAmount
                      ? `${purchase.totalAmount - purchase.paidAmount} Br `
                      : "No Credit"}
                  </TableCell>
                  <TableCell>{purchase.paidAmount.toFixed(2)} Br</TableCell>
                  <TableCell>{purchase.totalAmount.toFixed(2)} Br</TableCell>
                  <TableCell>{purchase.status}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        setSelectedPurchaseId(purchase.purchaseId);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No purchases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Purchase Order Modal */}
      {showModal && selectedPurchaseId && (
        <PurchaseOrderModal
          purchaseId={selectedPurchaseId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PurchaseTable;
