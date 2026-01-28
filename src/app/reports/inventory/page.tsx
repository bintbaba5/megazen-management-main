"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { addDays, format, startOfDay, endOfDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  Download,
  File,
  Mail,
  Share,
} from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";

import { AuditProps } from "@/global/types";

// import jsPDF from "jspdf";
// type InventoryProps = {
//   product: {
//     name: string;
//     category: {
//       name: string;
//     };
//   };
//   location: {
//     locationName: string;
//     locationAddress: string;
//   };
// };
// type TransfersProps = {
//   transferId: number;
//   destinationInventory: InventoryProps;
//   sourceInventory: InventoryProps;
// };
// type AuditHistory = {
//   id: number;
//   action: string;
//   oldQuantity: number;
//   newQuantity: number;
//   timestamp: string;
//   user: {
//     name: string;
//   };
//   inventory: InventoryProps;
//   transfers: TransfersProps[];
//   movement: TransfersProps[];
// };

const Page = () => {
  const [inventory, setInventory] = useState<AuditProps[]>([]);
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [loading, setLoading] = React.useState(false);

  // useEffect(() => {
  //   // Simulated API call to fetch filtered data
  //   const fetchInventory = async () => {
  //     // Replace with your API endpoint
  //     const response = await fetch(
  //       `/api/report/inventory?startDate=${format(
  //         startOfDay(date?.from),
  //         "yyyy-MM-dd"
  //       )}&endDate=${format(endOfDay(date?.to), "yyyy-MM-dd")}`
  //     );
  //     const data = await response.json();
  //     console.log(data.history);
  //     setInventory(data.history);
  //   };

  //   fetchInventory();
  // }, [date]);

  useEffect(() => {
    fetchInventory();
  }, [date, filter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/report/inventory?startDate=${format(
          startOfDay(date?.from),
          "yyyy-MM-dd"
        )}&endDate=${format(endOfDay(date?.to), "yyyy-MM-dd")}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inventory data.");
      }

      const data = await response.json();
      setInventory(data.history);

      toast({
        variant: "default",
        title: "Success!",
        description: "Inventory data fetched successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      setLoading(true);
      const csv = Papa.unparse(inventory);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `inventory_${new Date()}_report.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        variant: "default",
        title: "Success!",
        description: "Inventory exported to CSV successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description:
          "Failed to export inventory. Please check the data and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // const shareReport = () => {
  //   const url = `${window.location.origin}/?filter=${filter}`;
  //   const text = `Check out this inventory report for ${filter}: ${url}`;

  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: "Inventory Report",
  //         text,
  //         url,
  //       })
  //       .catch((err) => console.error("Error sharing:", err));
  //   } else {
  //     navigator.clipboard.writeText(url).then(() => {
  //       alert(
  //         "Sharing not supported on this device. Shareable link copied to clipboard!"
  //       );
  //     });
  //   }
  // };

  const shareReport = async () => {
    setLoading(true); // Start loading
    try {
      const url = `${window.location.origin}/?filter=${filter}`;
      const text = `Check out this inventory report for ${filter}: ${url}`;

      if (navigator.share) {
        await navigator.share({
          title: "Inventory Report",
          text,
          url,
        });
        toast({
          variant: "default",
          title: "Success!",
          description: "Report shared successfully!",
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          variant: "default",
          title: "Link Copied!",
          description: "Shareable link copied to clipboard!",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share the report. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // const doc = new jsPDF();
    // doc.text("Inventory Report", 10, 10);
    // let y = 20;
    // inventory.forEach((item) => {
    //   doc.text(
    //     `Product: ${item.productName}, Location: ${item.location}, Quantity: ${item.quantity}`,
    //     10,
    //     y
    //   );
    //   y += 10;
    // });
    // doc.save(`inventory_${filter}_report.pdf`);
  };
  // const shareViaEmail = () => {
  //   const subject = encodeURIComponent("Inventory Report");
  //   const body = encodeURIComponent(
  //     `Here is the inventory report:\n\n${JSON.stringify(inventory, null, 2)}`
  //   );
  //   const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  //   window.location.href = mailtoLink;
  // };

  const shareViaEmail = async () => {
    setLoading(true); // Start loading
    try {
      const subject = encodeURIComponent("Inventory Report");
      const body = encodeURIComponent(
        `Here is the inventory report:\n\n${JSON.stringify(inventory, null, 2)}`
      );
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

      window.location.href = mailtoLink;

      toast({
        variant: "default",
        title: "Success!",
        description: "Email client opened with the inventory report.",
      });
    } catch (error) {
      console.error("Error sharing via email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share the report via email. Please try again.",
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const shareData = () => {
    const baseUrl = window.location.href;
    const url = `${baseUrl}/?filter=${filter}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  };

  // if (loading) {
  //   return <div></div>;
  // }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center space-x-4">
        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <div className="">
          <div className="flex space-x-4">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={exportToCSV}
              title="Export to CSV"
            >
              <File size={24} />
            </button>

            <button
              className="text-gray-600 hover:text-green-600"
              onClick={exportToPDF}
              title="Export to PDF"
            >
              <Download size={24} />
            </button>

            {/* <button
              className="text-gray-600 hover:text-purple-600"
              onClick={() => {
                const url = `${window.location.origin}/?filter=${filter}`;
                navigator.clipboard
                  .writeText(url)
                  .then(() => alert("Shareable link copied to clipboard!"));
              }}
              title="Copy Shareable Link"
            >
              <Share size={24} />
            </button> */}

            <button
              className="text-gray-600 hover:text-red-600"
              onClick={shareViaEmail}
              title="Share via Email"
            >
              <Mail size={24} />
            </button>
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={shareReport}
              title="Share Report"
            >
              <Share size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* {inventory.map((item) => (
        <p key={item.inventoryId}>{item}</p>
      ))} */}
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Old Quantity</TableCell>
              <TableCell>New Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {inventory.length > 0 &&
              inventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span>{item.inventory?.product?.category?.name} </span>
                    <span className="mx-4">|</span>
                    <span className="mr-4">
                      {item.inventory?.product?.name}
                    </span>
                  </TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    {item.transfers &&
                      item.transfers.map((transfer) => (
                        <div key={transfer.transferId} className="">
                          {`${transfer.sourceInventory.location.locationName} -> ${transfer.destinationInventory.location.locationName}`}
                        </div>
                      ))}
                    {item?.movements &&
                      item?.movements.map((transfer) => (
                        <div key={transfer.movementId} className="">
                          {`${
                            transfer.type?.charAt(0).toUpperCase() +
                            transfer.type?.slice(1).toLowerCase()
                          }`}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell> {item.user.name}</TableCell>
                  <TableCell>{item.oldQuantity}</TableCell>
                  <TableCell>{item.newQuantity}</TableCell>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-center">
        {inventory.length == 0 && (
          <span className="text-center">
            No history found for the selected date range.
          </span>
        )}
      </div>
    </Card>
  );
};
export default Page;
