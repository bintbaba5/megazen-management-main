import Layout from "@/components/Layout/layout";

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
