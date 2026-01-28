import { prisma } from "@/prisma";
import OrderPage from "./OrderPage";

const Page = async () => {
  try {
    // Fetch inventory records, including the related product and category data
    const inventories = await prisma.inventory.findMany({
      where: {
        quantity: {
          gt: 0, 
        },
      },
      include: {
        product: {
          include: {
            category: true, 
          },
        },
        location: true, 
      },
    });

    if (!inventories.length) {
      console.log("No inventory records found.");
      return (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">No Inventory Available</h2>
          <p>No inventory records found with available products.</p>
        </div>
      );
    }

    // Extract unique products from inventory records
    const products = [
      ...new Map(
        inventories.map((record) => [record.product.productId, record.product])
      ).values(),
    ];

    if (!products.length) {
      console.log("No products found.");
      return (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">No Products Available</h2>
          <p>No products available in the current inventory.</p>
        </div>
      );
    }

    // Extract unique category IDs from products
    const categoryIds = [
      ...new Set(products.map((product) => product.categoryId)),
    ];

    const categories = await prisma.categories.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    if (!categories.length) {
      console.log("No categories found.");
      return (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">No Categories Available</h2>
          <p>No categories associated with the current products.</p>
        </div>
      );
    }

    // Pass data as props to the OrderPage
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">New Sales Order</h2>
        <OrderPage
          initialInventories={inventories}
          initialCategories={categories}
          initialProducts={products}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading data:", error);
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
        <p>There was an error fetching data. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
