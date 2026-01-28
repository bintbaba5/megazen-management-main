import { prisma } from "@/prisma";
import OrderListTable from "./OrderListTable";

type SaleProps = {
  saleId: number;
  customerName: string;
  customerContact: string | null;
  orderDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  salesOrderLineItems: {
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
  let sales: SaleProps[] = [];

  try {
    sales = await prisma.sales.findMany({
      include: {
        SalesOrderLineItems: {
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
        orderDate: "desc", 
      },
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sells Order List </h2>
      {sales.length > 0 ? (
        <OrderListTable sales={sales} />
      ) : (
        <p>No sales data available.</p>
      )}
    </div>
  );
};

export default Page;
