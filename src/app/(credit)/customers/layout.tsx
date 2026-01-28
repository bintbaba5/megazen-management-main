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
    { label: "Customers", isCurrentPage: true },
  ];
  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end px-4 pt-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
        {children}
      </div>
    </Layout>
  );
}
