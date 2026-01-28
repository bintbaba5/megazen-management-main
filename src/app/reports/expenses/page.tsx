import { prisma } from "@/prisma";
import ExpenseTable from "./expenseTable";


const Page = async () => {
  const expenses = await prisma.expenses.findMany({
    orderBy: {
      title: "asc", 
    },
  });
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Management</h2>
      {/* Render the client-side Inventory Table */}
      <ExpenseTable expenses={expenses}/>
    </div>
  );
};

export default Page;
