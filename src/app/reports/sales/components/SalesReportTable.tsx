import { useState } from "react";
import SalesOrderModal from "./SalesOrderModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";
import { SalesProps } from "@/global/types";

const SalesTable = ({
  data,
  isLoading,
}: {
  data: SalesProps[];
  isLoading: boolean;
}) => {
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewClick = (saleId: number) => {
    setSelectedSaleId(saleId);
    setShowModal(true);
    toast({
      variant: "default",
      title: "Success!",
      description: `Viewing details for Sale #${saleId}`,
    });
  };

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
        <div className="flex justify-center items-center">
          <Loader /> {/* Display loader when data is loading */}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length ? (
              data.map((sale) => (
                <TableRow
                  key={sale.saleId}
                  className={
                    sale.totalAmount - sale.payedAmount
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  <TableCell>{sale.customer?.name}</TableCell>
                  <TableCell>
                    {new Date(sale.orderDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{sale.totalAmount.toFixed(2)} Br</TableCell>
                  <TableCell>{sale.payedAmount.toFixed(2)} Br</TableCell>
                  <TableCell>
                    {sale.totalAmount - sale.payedAmount
                      ? `${sale.totalAmount - sale.payedAmount} Br `
                      : "No Credit"}
                  </TableCell>
                  <TableCell>{sale.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewClick(sale.saleId)}
                      type="button"
                      variant="outline"
                      className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Sales Order Modal */}
      {showModal && selectedSaleId && (
        <SalesOrderModal
          saleId={selectedSaleId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SalesTable;
