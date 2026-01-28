"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";
// import Modal from "@/components/Modal";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Loader from "@/common/Loader";
import { StockTransfersProps } from "@/global/types";
import { AlertDialogComponent } from "@/components/AlertDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const dateRanges = {
  daily: startOfDay(new Date()),
  weekly: startOfWeek(new Date()),
  monthly: startOfMonth(new Date()),
  yearly: startOfYear(new Date()),
};

const Page = () => {
  const [stockTransfers, setStockTransfers] = useState<StockTransfersProps[]>(
    []
  );
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [datePeriod, setDatePeriod] = useState("weekly");
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<StockTransfersProps>();
  const [updatedTransfer, setUpdatedTransfer] = useState<StockTransfersProps>();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  useEffect(() => {
    fetchStockTransfers();
  }, [date, datePeriod]);

  const fetchStockTransfers = async () => {
    let query = "?";

    if (date?.from && date.to) {
      query += `startDate=${date.from}&endDate=${date.to}`;
    } else if (datePeriod) {
      const periodStart = format(dateRanges[datePeriod], "yyyy-MM-dd");
      const today = format(
        new Date().setDate(new Date().getDate() + 1),
        "yyyy-MM-dd"
      );
      query += `startDate=${periodStart}&endDate=${today}`;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/stock-transfer${query ? query : ""}`);
      const data = await response.json();
      setStockTransfers(data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error fetching stock transfers: ${error}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = (transfer: StockTransfersProps) => {
    setSelectedTransfer(transfer);
    setUpdatedTransfer(transfer);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof StockTransfersProps
  ) => {
    if (updatedTransfer) {
      setUpdatedTransfer({
        ...updatedTransfer,
        [field]:
          field === "quantity" ? parseInt(e.target.value) : e.target.value,
      });
    }
  };

  const handleCancel = () => {
    setSelectedTransfer(undefined);
    setUpdatedTransfer(undefined);
  };

  const handleUpdateSubmit = async () => {
    try {
      // throw new Error("Method not implemented.");
      await fetch(`/api/stock-transfer/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransfer),
      });
      toast({
        variant: "default",
        title: "Success",
        description: "Stock transfer updated successfully",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
      handleCancel();
      fetchStockTransfers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error updating stock transfer: ${error}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/stock-transfer/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transferId: id }),
      });
      toast({
        variant: "default",
        title: "Success",
        description: "Stock transfer deleted successfully",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
      fetchStockTransfers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error deleting stock transfer: ${error}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }
  };
  // if (loading) {
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Stock Transfers</h1>
        {/* <Modal
          title="Transfer Inventory"
          description="Transfer inventory stock"
          triggerText="Transfer"
          cancelText="Cancel"
          open={isOpen}
          setOpen={setIsOpen}
          formComponent={
            <></>
            // <StockTransferForm
            //   product={products.find(
            //     (product) =>
            //       product.productId === inventory.productId
            //   )}
            //   locations={locations}
            //   onSubmitSuccess={handleTransfer}
            //   setOpen={setIsOpen}
            // />
          }
        /> */}
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  " justify-start text-left font-normal",
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
        {/* <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        /> */}
        <Select
          onValueChange={(value) => {
            setDatePeriod(value);
          }}
          defaultValue={"daily"}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select Date Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {/* <Button onClick={fetchStockTransfers}>Filter</Button> */}
      </div>
      <Table>
        <TableCaption>Stock Transfers Log</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Source Location</TableHead>
            <TableHead>Destination Location</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? // Show skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" /> {/* Category Name */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" /> {/* Description */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" /> {/* Description */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" /> {/* Description */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[100px] ml-auto" />{" "}
                    {/* Created At */}
                  </TableCell>
                  <TableCell className="text-center flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Skeleton className="h-8 w-[60px]" /> {/* Edit Button */}
                    <Skeleton className="h-8 w-[70px]" /> {/* Delete Button */}
                  </TableCell>
                </TableRow>
              ))
            : stockTransfers?.map((transfer) => (
                <TableRow key={transfer.transferId}>
                  <TableCell>{transfer.product.name}</TableCell>
                  <TableCell>
                    {selectedTransfer?.transferId === transfer.transferId ? (
                      <input
                        type="number"
                        value={updatedTransfer?.quantity || 0}
                        onChange={(e) => handleChange(e, "quantity")}
                        className="border p-1 rounded-md"
                      />
                    ) : (
                      transfer.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {transfer.sourceInventory.location.locationName}
                  </TableCell>
                  <TableCell>
                    {transfer.destinationInventory.location.locationName}
                  </TableCell>
                  <TableCell>
                    {new Date(transfer.timestamp).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {selectedTransfer?.transferId === transfer.transferId ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="border border-green-500 hover:bg-green-500 hover:text-white-500"
                          onClick={() => handleUpdateSubmit()}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="border border-red-500 hover:bg-red-500 hover:text-white-500"
                          onClick={() => handleCancel()}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="border border-blue-500 hover:bg-blue-500 hover:text-white-500"
                          onClick={() => handleUpdate(transfer)}
                        >
                          Update
                        </Button>
                        <AlertDialogComponent
                          inventoryId={transfer.transferId}
                          triggerLabel="Delete"
                          title="Are you sure you want to delete this stock transfer?"
                          description="This action cannot be undone."
                          cancelLabel="Cancel"
                          actionLabel="Delete"
                          onAction={() => handleDelete(transfer.transferId)}
                          style="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white"
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
