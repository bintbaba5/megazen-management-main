import { prisma } from "@/prisma";
import ExpenseTable from "./expenseTable";

const Page = async () => {
  const expenses = await prisma.expenses.findMany();
  return (
    <div className="container w-full ">
      <h2 className="text-2xl font-bold mb-4 pl-8">Expense Management</h2>
      {/* Render the client-side Inventory Table */}
      <ExpenseTable expenses={expenses} />
    </div>
  );
};

export default Page;
