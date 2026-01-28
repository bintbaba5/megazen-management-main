"use client";
import React, { useState, useEffect } from "react";
import { ReportFilters } from "@/components/reports/ReportFilters";
import SalesTable from "./components/SalesReportTable";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import Loader from "@/common/Loader";
import { SalesProps } from "@/global/types";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import SalesReportPDF from "@/components/SalesReportPDF";
// import { Download } from "lucide-react";

type SalesReportProps = {
  sales: SalesProps[];
  totalCount: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalCreditAmount: number;
  totalExpense: number;
};

const Page = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [data, setData] = useState<SalesProps[]>([]);
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
    fetch("/api/report/sales?" + query)
      .then((res) => res.json())
      .then((data: SalesReportProps) => {
        setData(data.sales || []);
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
          description: "An error occurred while fetching data.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange, paymentStatus, customerName]);
  const price = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    // minimumFractionDigits: 2,
  });

  const exportToCSV = () => {
    if (!data) {
      toast({
        variant: "destructive",
        title: "No Data!",
        description: "No data is selected exported to CSV!",
      });
      return;
    }
    // Flatten the data to ensure no nested objects
    const flattenedData = data.map((item) => ({
      saleId: item.saleId,
      customerName: item.customer.name,
      orderDate: item.orderDate,
      totalAmount: item.totalAmount,
      paidAmount: item.payedAmount,
      creditAmount: item.totalAmount - item.payedAmount,
      status: item.status,
    }));

    const csv = Papa.unparse(flattenedData); // Convert flattened data to CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sales_${new Date().toISOString()}_report.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      variant: "default",
      title: "Success!",
      description: "Sale report successfully exported to CSV!",
    });
  };

  const shareReport = () => {
    const url = `${window.location.origin}/?filter=${paymentStatus}`;
    const text = `Check out this inventory report for ${paymentStatus}: ${url}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Sales Report",
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

  // const exportToPDF = ({ data }) => {
  //   <PDFDownloadLink
  //     document={<SalesReportPDF data={data} />}
  //     fileName={`sales_${new Date().toISOString()}_report.pdf`}
  //   >
  //     <Download size={24} />
  //     {/* {({ loading }) => (loading ? "Preparing document..." : "Download PDF")} */}
  //   </PDFDownloadLink>;
  // };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Inventory Report");
    const body = encodeURIComponent(
      `Here is the inventory report:\n\n${JSON.stringify(data, null, 2)}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  // if (loading) {
  //   return (
  //   <div>
  //     <Loader/>
  //   </div>);
  // }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sales Reports</h1>

      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4  p-4 rounded-lg shadow mb-4">
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
        // onExportToPDF={exportToPDF}
        onShareViaEmail={shareViaEmail}
      />
      {/* Sales Table */}
      <div className="overflow-x-auto mt-6">
        {loading ? <Loader /> : <SalesTable data={data} isLoading={false} />}
      </div>
    </div>
  );
};

export default Page;
