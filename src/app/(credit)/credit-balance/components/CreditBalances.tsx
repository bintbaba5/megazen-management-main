"use client";
import { useState } from "react";
import CreditBalanceTable from "./CreditBalanceTable";
import CreditBalanceForm from "./CreditBalanceForm";
import CreditBalanceFilter from "./CreditBalanceFilter";

export default function CreditBalances({ balances }) {
  // const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalances] = useState(balances);

  const [filters, setFilters] = useState({
    customer: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const fetchCreditBalance = async () => {
    const res = await fetch("/api/credit-balance");
    const data = await res.json();
    setBalances(data);
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex  items-center">
        {/* Filters */}
        <CreditBalanceFilter filters={filters} setFilters={setFilters} />

        {/* Form */}
        <CreditBalanceForm fetchCreditBalance={fetchCreditBalance} />
      </div>

      {/* List Table */}
      <CreditBalanceTable balances={balance} filters={filters} />
    </div>
  );
}
