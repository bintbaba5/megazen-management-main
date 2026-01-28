import React, { ReactNode } from "react";
// import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "../Navbar/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await auth();
  // const router = useRouter;
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar />
          {/* Main Content */}
          <main>
            <SidebarTrigger />

            {children}
          </main>
        </div>
      </SidebarProvider>

      {/* Footer */}
    </div>
  );
};

export default Layout;
