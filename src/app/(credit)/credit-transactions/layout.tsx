import Layout from "@/components/Layout/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BreadcrumbComponent from "@/components/Breadrumb";
export default function CreditTransactionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Credit Transaction", isCurrentPage: true },
  ];
  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end px-4 pt-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
        {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Products</h1>
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
