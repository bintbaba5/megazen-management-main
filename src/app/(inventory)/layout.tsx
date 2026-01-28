import BreadcrumbComponent from "@/components/Breadrumb";
import Layout from "@/components/Layout/layout";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "inventory", isCurrentPage: true },
  ];
  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end px-4 pt-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
        {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <div className="flex justify-between items-center gap-3">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </div>
        </div> */}
        {children}
      </div>
    </Layout>
  );
}
