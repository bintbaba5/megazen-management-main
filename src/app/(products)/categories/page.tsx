import { prisma } from "@/prisma";
import CategoryTable from "./CategoryTable";

const Page = async () => {
  const categories = await prisma.categories.findMany({
    orderBy: {
      name: "asc", // Replace `createdAt` with the appropriate field for sorting
    },
  });
  return (
    <div className="container mx-auto p-4">
      {/* Render the client-side ProductTable */}

      <CategoryTable
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        categories={categories}
      />
    </div>
  );
};
export default Page;
