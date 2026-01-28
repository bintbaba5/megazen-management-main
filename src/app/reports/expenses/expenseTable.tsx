"use client";
import React, { useState, useEffect } from "react";
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

import { toast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import Loader from "@/common/Loader";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";

const ExpenseTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});
  // const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expense");
      const data = await response.json();
      setExpenses(data.expenses);
      calculateTotal(data.expenses);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch expenses. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpense(total);
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (!dateRange?.from && !dateRange?.to) return true;
    const expenseDate = new Date(expense.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    return (
      (!fromDate || expenseDate >= fromDate) &&
      (!toDate || expenseDate <= toDate)
    );
  });

  useEffect(() => {
    fetchExpenses();
  }, []);
  const price = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    // minimumFractionDigits: 2,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-screen mx-auto">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* <Input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            placeholder="From Date"
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange({ ...dateRange, to: e.target.value })
            }
            placeholder="To Date"
          />
          <Button onClick={fetchExpenses} className="md:w-auto">
            Apply Filters
          </Button> */}
          <DatePickerWithRange
            className="w-full md:w-auto"
            onSelect={(range) => setDateRange(range)}
          />
        </div>
        <div className="text-lg font-semibold">
          አጠቃላይ ወጪ: {totalExpense.toFixed(2)} ብር
          {/* Total Expense: {price.format(totalExpense)} */}
        </div>
      </div>

      {/* Expense Table */}
      <Table className="w-full  rounded-lg shadow-sm">
        <TableCaption className="text-sm">
          A list of recorded expenses.
        </TableCaption>
        <TableHeader className="">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses?.map((expense) => (
            <TableRow key={expense.expenseId} className="">
              <TableCell>{expense.expenseId}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.amount.toFixed(2)} ብር</TableCell>
              <TableCell>
                {new Date(expense.date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
