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

export function CreditTransactionForm() {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [suppliers, setSuppliers] = useState<SuppliersProps[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    supplierId: "",
    type: "Customer",
    amount: "",
    description: "",
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

    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/supplier");
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        const data = await res.json();
        setSuppliers(data.suppliers);
      } catch (err) {
        setError("Error fetching suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    fetchSuppliers();
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
        const res = await fetch("/api/credit-transactions", {
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
      title="Add Credit Transaction"
      open={open}
      setOpen={setOpen}
      description=""
      triggerText="Add Credit Transaction"
      cancelText="Cancel"
      style="flex w-full ml-2 mt-6 items-center text-green-500 border border-green-500 hover:bg-green-500 hover:text-white"
      formComponent={
        <form onSubmit={handleSubmit} className="space-y-4 m-4">
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.type === "Customer" && (
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
          )}

          {form.type === "Supplier" && (
            <div>
              <Label>Select Supplier</Label>
              <Select
                value={form.supplierId}
                onValueChange={(value) => handleChange("supplierId", value)}
              >
                <SelectTrigger>
                  <span>
                    {suppliers.find(
                      (supplier) =>
                        supplier.supplierId === parseInt(form.supplierId)
                    )?.name || "Select Supplier"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Select Supplier
                  </SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.supplierId}
                      value={supplier.supplierId}
                    >
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Type the description here."
              id="message"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
