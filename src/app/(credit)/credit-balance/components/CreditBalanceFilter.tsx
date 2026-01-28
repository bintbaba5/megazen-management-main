import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

type Props = {
  filters: {
    customer: string;
    type: string;
    startDate: string;
    endDate: string;
  };
  setFilters: (filters: {
    customer: string;
    type: string;
    startDate: string;
    endDate: string;
  }) => void;
};

const CreditBalanceFilter = ({ filters, setFilters }: Props) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  return (
    <div className="w-full flex gap-4">
      <div className="w-full">
        <Label>Customer</Label>
        <Input
          value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
          placeholder="Filter by name"
        />
      </div>
      <div className="w-full">
        <Label>Type</Label>
        <Select
          onValueChange={(value) => setFilters({ ...filters, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">All</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Supplier">Supplier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <div className="w-full">
        <Label>Date Range</Label>
        <DatePickerWithRange
          className="w-full "
          onSelect={(range) =>
            setFilters({
              ...filters,
              startDate: range?.from ? range?.from?.toISOString() : "",
              endDate: range?.to ? range?.to?.toISOString() : "",
            })
          }
        />
      </div> */}
      {/* <div className="w-full">
        <Label>Start Date</Label>
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
      </div>
      <div className="w-full">
        <Label>End Date</Label>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div> */}
    </div>
  );
};

export default CreditBalanceFilter;
