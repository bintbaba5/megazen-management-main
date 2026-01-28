import Layout from "@/components/Layout/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <div className="flex flex-col gap-5">{children}</div>
    </Layout>
  );
}
