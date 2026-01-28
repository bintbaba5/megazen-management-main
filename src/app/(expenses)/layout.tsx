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
    { label: "Expense", isCurrentPage: true },
  ];
  return (
    <Layout>
      <div className="">
        <div className="flex justify-end px-4 pt-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
        {children}
      </div>
    </Layout>
  );
}
