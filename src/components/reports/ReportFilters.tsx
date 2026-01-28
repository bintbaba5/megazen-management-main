import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Input } from "../ui/input";
import { Download, File, Mail, Share } from "lucide-react";

interface ReportFiltersProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  paymentStatus: string;
  onDateRangeChange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  onPaymentStatusChange: (status: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onExportToCSV: () => void;
  onShareReport: () => void;
  // onExportToPDF: ({ data }) => React.ReactNode;
  onShareViaEmail: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  dateRange,
  paymentStatus,
  onDateRangeChange,
  onPaymentStatusChange,
  customerName,
  onCustomerNameChange,
  onExportToCSV,
  onShareReport,
  // onExportToPDF,
  onShareViaEmail,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <Input
        placeholder="Filter customer name..."
        value={customerName}
        onChange={(event) => {
          onCustomerNameChange(event.target.value);
        }}
        className="max-w-sm"
      />
      <DatePickerWithRange
        className="w-full md:w-auto"
        onSelect={(range) => onDateRangeChange(range)}
      />
      <Select onValueChange={onPaymentStatusChange} value={paymentStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Unpaid">Unpaid</SelectItem>
          <SelectItem value="Partial">Partial</SelectItem>
          {/* <SelectItem value="Pending">Pending</SelectItem> */}
        </SelectContent>
      </Select>
      <div className="">
        <div className="flex space-x-4">
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={onExportToCSV}
            title="Export to CSV"
          >
            <Download size={24} />
          </button>

          {/* <onExportToPDF data={data} /> */}

          {/* <button
            className="text-gray-600 hover:text-green-600"
            onClick={onExportToPDF}
            title="Export to PDF"
          >
            <Download size={24} />
          </button> */}

          <button
            className="text-gray-600 hover:text-red-600"
            onClick={onShareViaEmail}
            title="Share via Email"
          >
            <Mail size={24} />
          </button>
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={onShareReport}
            title="Share Report"
          >
            <Share size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
