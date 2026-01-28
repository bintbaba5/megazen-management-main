import { prisma } from "@/prisma";
import OrderListTable from "./OrderListTable";

type PurchaseProps = {
  purchaseId: number;
  supplierName: string;
  supplierPhone: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  purchaseOrderLineItems: {
    product: {
      name: string;
      productId: number;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
};

const Page = async () => {
  let purchaseOrders: PurchaseProps[] = [];

  try {
    purchaseOrders = await prisma.purchases.findMany({
      include: {
        PurchaseOrderLineItems: {
          include: {
            product: {
              select: {
                name: true,
                productId: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc", 
      },
    });
  } catch (error) {
    console.error("Error fetching purchase orders data:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Purchase Order List</h2>
      {purchaseOrders.length > 0 ? (
        <OrderListTable purchaseOrders={purchaseOrders} />
      ) : (
        <p>No purchase orders data available.</p>
      )}
    </div>
  );
};

export default Page;
