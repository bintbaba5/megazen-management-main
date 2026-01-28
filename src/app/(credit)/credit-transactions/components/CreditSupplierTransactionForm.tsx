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

export default function CreditSupplierTransactionForm() {
  const [suppliers, setSuppliers] = useState<SuppliersProps[]>([]);
  const [form, setForm] = useState({
    supplierId: "",
    amount: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for customers and suppliers
  const [error, setError] = useState<string | null>(null); // For error handling

  useEffect(() => {
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
        const res = await fetch("/api/credit-transactions/allocate-supplier", {
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
      title="Allocate Supplier Credit"
      open={open}
      setOpen={setOpen}
      description=""
      triggerText="Allocate Supplier Credit"
      cancelText="Cancel"
      style="flex w-full ml-2 mt-6 items-center text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
      formComponent={
        <form onSubmit={handleSubmit} className="space-y-4 m-4">
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
