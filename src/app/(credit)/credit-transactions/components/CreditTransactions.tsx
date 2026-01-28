"use client";
import { useState } from "react";
import CreditTransactionFilter from "./CreditTransactionFilter";
import { CreditTransactionForm } from "./CreditTransactionForm";
import CreditTransactionTable from "./CreditTransactionTable";
import CreditSupplierTransactionForm from "./CreditSupplierTransactionForm";
import CreditCustomerTransactionForm from "./CreditCustomerTransactionForm";

export default function CreditTransactions({ transactions }) {
  const [filters, setFilters] = useState({
    customer: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  return (
    <div className="space-y-6">
      <div className="w-full flex  items-center">
        {/* Filters */}

        <CreditTransactionFilter filters={filters} setFilters={setFilters} />

        {/* Form */}
      </div>
      <div className="flex gap-4 w-full">
        <CreditTransactionForm />
        <CreditSupplierTransactionForm />
        <CreditCustomerTransactionForm />
      </div>

      {/* List Table */}
      <CreditTransactionTable transactions={transactions} filters={filters} />
    </div>
  );
}
