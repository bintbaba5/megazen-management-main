import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomersProps, SuppliersProps } from "@/global/types";

import { useEffect, useState, useCallback } from "react";

export default function CreditCustomerTransactionForm() {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for customers and suppliers
  const [error, setError] = useState<string | null>(null); // For error handling

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/customer");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data.customers);
      } catch (err) {
        setError("Error fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Reusable handleChange for select inputs
  const handleChange = useCallback((field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch("/api/credit-transactions/allocate-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to submit transaction");
        setOpen(false); // Close modal on success
      } catch (err) {
        setError("Error submitting transaction");
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <Modal
      title="Allocate Customer Credit"
      open={open}
      setOpen={setOpen}
      description=""
      triggerText="Allocate Customer Credit"
      cancelText="Cancel"
      style="flex w-full ml-2 mt-6 items-center text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white"
      formComponent={
        <form onSubmit={handleSubmit} className="space-y-4 m-4">
          <div>
            <Label>Select Customer</Label>
            <Select
              value={form.customerId}
              onValueChange={(value) => handleChange("customerId", value)}
            >
              <SelectTrigger>
                <span>
                  {customers.find(
                    (customer) =>
                      customer.customerId === parseInt(form.customerId)
                  )?.name || "Select a Customer"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>
                  Select customer
                </SelectItem>
                {customers.map((customer) => (
                  <SelectItem
                    key={customer.customerId}
                    value={customer.customerId}
                  >
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <Button
            variant={"outline"}
            type="submit"
            className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Transaction"}
          </Button>
        </form>
      }
    />
  );
}
