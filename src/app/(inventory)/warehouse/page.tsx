import { prisma } from "@/prisma";
import LocationTable from "./components/LocationTable";

const Page = async () => {
  // Fetch Inventories with related Product data
  // let locations = [];
  // try {
  // const locations = await prisma.locations.findMany({
  //   include: {
  //     inventory: true, // Include product relation
  //   },
  // });
  // } catch (error) {
  //   console.error(error);
  // }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      {/* Render the client-side Inventory Table */}
      <LocationTable />
    </div>
  );
};

export default Page;
