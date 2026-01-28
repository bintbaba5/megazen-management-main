import { prisma } from "@/prisma";
import InvetoryTable from "./components/InvetoryTable";

type InventoryProps = {
  inventoryId: string;
  productId: number;
  warehouseStock: number;
  shopStock: number;
  lastUpdated: Date;
  product: {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
    description: string | null;
    categoryId: number | null;
  };
};
const Page = async () => {
  const inventories = await prisma.inventory.findMany({
    include: {
      product: true,
    },
    orderBy: {
      product: {
        name: "asc",
      },
    },
  });

  const locations = await prisma.locations.findMany();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      {/* Render the client-side Inventory Table */}
      <InvetoryTable inventories={inventories} locations={locations} />
    </div>
  );
};

export default Page;
