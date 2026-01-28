import { prisma } from "@/prisma";

import ProductTable from "./ProductTable";
// import ProductTable from "@/components/ProductTable";

const Page = async () => {
  // Fetch products from the server
  const products = await prisma.products.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc", // Orders the products alphabetically by name (A → Z)
    },
  });
  const categories = await prisma.categories.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc", // Orders the products alphabetically by name (A → Z)
    },
  });
  return (
    <div className="container mx-auto p-6">
      {/* Render the client-side ProductTable */}
      <ProductTable
        products={products}
        categories={categories.map((category) => ({
          categoryId: category.id,
          name: category.name,
        }))}
      />
    </div>
  );
};
export default Page;
