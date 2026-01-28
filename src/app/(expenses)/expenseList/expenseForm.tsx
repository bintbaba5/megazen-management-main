import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Loader from "@/common/Loader";

interface ExpenseFormProps {
  onSubmitSuccess: () => void;
  setOpen: (open: boolean) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmitSuccess, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    amount: "",
  });

  const validateForm = () => {
    const errors = { title: "", amount: "" };
    if (!title.trim()) errors.title = "Title is required.";
    if (amount <= 0) errors.amount = "Amount must be greater than 0.";

    setFormErrors(errors);
    return !Object.values(errors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, amount }),
      });

      if (response.ok) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Expense successfully created.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        onSubmitSuccess();
        toast({
          variant: "default",
          title: "Success!",
          description: "Expense successfully created.",
        });
        setOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Failed to create expense. Please try again.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-lg w-full mx-auto"
    >
      <h2 className="text-2xl font-semibold dark:text-white">Add Expense</h2>

      {/* Title */}
      <div>
        <Label htmlFor="title" className="mb-2 dark:text-gray-300">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${formErrors.title ? "border-red-500" : ""}`}
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-2 dark:text-gray-300">
          Description (Optional)
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Date */}
      <div>
        <Label htmlFor="date" className="mb-2 dark:text-gray-300">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="mb-2 dark:text-gray-300">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className={`w-full ${formErrors.amount ? "border-red-500" : ""}`}
          min="0.01"
          step="0.01"
        />
        {formErrors.amount && (
          <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="outline" className="w-full">
        {loading ? "Saving..." : "Save Expense"}
      </Button>
    </form>
  );
};

export default ExpenseForm;
