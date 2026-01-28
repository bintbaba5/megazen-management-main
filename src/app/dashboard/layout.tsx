import Layout from "@/components/Layout/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end px-4 pt-4"></div>

        {children}
      </div>
    </Layout>
  );
}
