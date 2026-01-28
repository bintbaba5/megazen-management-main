"use client";
import React, { useState, useEffect } from "react";
import { ReportFilters } from "@/components/reports/ReportFilters";
import PurchaseTable from "./components/PurchaseReportTable";
import Papa from "papaparse";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";
import { PurchasesProps } from "@/global/types";

const Page = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [data, setData] = useState<PurchasesProps[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalAmount: number;
    totalPaidAmount: number;
    totalCreditAmount: number;
    totalExpense: number;
  }>({
    totalAmount: 0,
    totalPaidAmount: 0,
    totalCreditAmount: 0,
    totalExpense: 0,
  });

  // Fetch sales data
  useEffect(() => {
    const query = new URLSearchParams({
      startDate: dateRange?.from?.toISOString() || "",
      endDate: dateRange?.to?.toISOString() || "",
      paymentStatus,
      customerName,
    }).toString();
    setLoading(true);

    fetch("/api/report/purchases?" + query)
      .then((res) => res.json())
      .then((data) => {
        setData(data.purchases);
        setSummary({
          totalAmount: data.totalAmount,
          totalPaidAmount: data.totalPaidAmount,
          totalCreditAmount: data.totalCreditAmount,
          totalExpense: data.totalExpense,
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "An error occurred while fetching data." + error,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange, paymentStatus, customerName]);

  const exportToCSV = () => {
    const flattenedData = data.map((item) => ({
      purchaseId: item.purchaseId,
      customerName: item.supplier.name,
      orderDate: item.orderDate,
      totalAmount: item.totalAmount,
      paidAmount: item.paidAmount,
      creditAmount: item.totalAmount - item.paidAmount,
      status: item.status,
    }));

    const csv = Papa.unparse(flattenedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `purchase_${new Date().toISOString()}_report.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      variant: "default",
      title: "Success!",
      description: "Purchase report successfully exported to CSV!",
    });
  };

  const shareReport = () => {
    const url = `${window.location.origin}/?filter=${paymentStatus}`;
    const text = `Check out this inventory report for ${paymentStatus}: ${url}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Purchase Report",
          text,
          url,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          variant: "default",
          title: "Success!",
          description: "Shareable link copied to clipboard!",
        });
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Purchase Report");
    const body = encodeURIComponent(
      `Here is the purchase report:\n\n${JSON.stringify(data, null, 2)}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const price = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  });

  // if (loading) {
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Purchase Reports</h1>
      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg shadow mb-4">
        <div className="text-center">
          <h2 className="text-lg font-medium">Total Amount</h2>
          <p className="text-xl font-bold">
            {price.format(summary.totalAmount)}
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-medium">Total Paid Amount</h2>
          <p className="text-xl font-bold">
            {price.format(summary.totalPaidAmount)}
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-medium">Total Credit Amount</h2>
          <p className="text-xl font-bold">
            {price.format(summary.totalCreditAmount)}
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-medium">Total Expense</h2>
          <p className="text-xl font-bold">
            {price.format(summary.totalExpense)}
          </p>
        </div>
      </div>

      <ReportFilters
        dateRange={dateRange}
        paymentStatus={paymentStatus}
        onDateRangeChange={setDateRange}
        onPaymentStatusChange={setPaymentStatus}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onExportToCSV={exportToCSV}
        onShareReport={shareReport}
        onShareViaEmail={shareViaEmail}
      />

      <div className="overflow-x-auto mt-6">
        {loading ? <Loader /> : <PurchaseTable data={data} />}
      </div>
    </div>
  );
};

export default Page;
