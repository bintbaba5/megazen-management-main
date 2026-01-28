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
import Modal from "@/components/Modal";
import { toast } from "@/hooks/use-toast";
import ExpenseForm from "./expenseForm";
import { Input } from "@/components/ui/input";
import Loader from "@/common/Loader";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";

const ExpenseTable = () => {
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
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

  const updateExpense = async (expenseId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedExpense),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense updated successfully.",
        });
        fetchExpenses();
        setEditingExpenseId(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update expense.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating expense.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense deleted successfully.",
        });
        fetchExpenses();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete expense.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting expense.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pl-4 mb-6">
        <div className="flex gap-4">
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
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="mb-4 flex justify-end">
        <Modal
          title="Add New Expense"
          description="Fill in the details of the new expense."
          triggerText="Add Expense"
          open={isExpenseFormOpen}
          setOpen={setIsExpenseFormOpen}
          style="border border-green-500 hover:bg-green-500 hover:text-white"
          formComponent={
            <ExpenseForm
              onSubmitSuccess={() => {
                setIsExpenseFormOpen(false);
                fetchExpenses();
              }}
            />
          }
        />
      </div>

      {/* Expense Table */}
      <Table className="w-full rounded-lg shadow-sm">
        <TableCaption className="text-sm ">
          A list of recorded expenses.
        </TableCaption>
        <TableHeader className="">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.expenseId} className="">
              <TableCell>{expense.expenseId}</TableCell>
              {editingExpenseId === expense.expenseId ? (
                <>
                  <TableCell>
                    <Input
                      value={editedExpense.title || ""}
                      onChange={(e) =>
                        setEditedExpense({
                          ...editedExpense,
                          title: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedExpense.description || ""}
                      onChange={(e) =>
                        setEditedExpense({
                          ...editedExpense,
                          description: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedExpense.amount || ""}
                      onChange={(e) =>
                        setEditedExpense({
                          ...editedExpense,
                          amount: parseFloat(e.target.value),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={editedExpense.date || ""}
                      onChange={(e) =>
                        setEditedExpense({
                          ...editedExpense,
                          date: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"outline"}
                      onClick={() => updateExpense(expense.expenseId)}
                      className="border border-green-500 hover:bg-green-500 hover:text-white"
                    >
                      Save
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => setEditingExpenseId(null)}
                      className="border border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount.toFixed(2)} ብር</TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-4">
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setEditingExpenseId(expense.expenseId);
                        setEditedExpense(expense);
                      }}
                      className="border border-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => deleteExpense(expense.expenseId)}
                      className="border border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
