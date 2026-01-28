import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import KPIBox from "./components/kpis/KPIBox";
import { BellOff, BellRing } from "lucide-react";
import useFcmToken from "@/hooks/useFcmToken";
// import { useEffect, useState } from "react";
// import SalesTable from "../reports/sales/components/SalesReportTable";
import Loader from "@/common/Loader";
import usePushNotification from "@/hooks/usePushNotification";
import { useSession } from "next-auth/react";
import Charts from "./components/charts/Charts";
import ErrorBoundary from "@/components/Error/ErrorBoundary";

export default async function Page() {
  // const { data: session, status } = useSession();

  // const { sendNotification } = usePushNotification();
  // const { token, notificationPermissionStatus } = useFcmToken();
  // useEffect(() => {
  //   if (notificationPermissionStatus === null) {
  //     Notification.requestPermission().then((permission) => {
  //       console.log(`Notification permission: ${permission}`);
  //     });
  //   }
  // }, [notificationPermissionStatus]);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleTestNotification = async () => {
  //   await sendNotification({
  //     token: session?.user?.notificationToken || token,
  //     title: "Test Notification",
  //     message: "This is a test notification",
  //     link: "/contact",
  //   });
  // };

  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <div className="relative">
      {/* <div className="absolute right-0 top-0 mr-4">
        {notificationPermissionStatus === "granted" ? (
          <BellRing size={20} onClick={handleTestNotification} />
        ) : notificationPermissionStatus !== null ? (
          <BellOff
            size={20}
            onClick={handleTestNotification}
            className="cursor-pointer"
          />
        ) : null}
      </div> */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Megazen</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-col gap-4 p-2 pt-0">
        <KPIBox />
        <Charts />
      </div>
    </div>
  );
}
