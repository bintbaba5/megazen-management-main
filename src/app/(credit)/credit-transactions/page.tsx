import CreditTransactions from "./components/CreditTransactions";
import { prisma } from "@/prisma";

export default async function Page() {
  try {
    const transactions = await prisma.creditTransactions.findMany({
      include: {
        customer: true,
        supplier: true,
        sale: true,
        purchase: true,
      },
      orderBy: { date: "desc" },
    });

    return (
      <div className="container mx-auto p-6">
        <CreditTransactions transactions={transactions} />
      </div>
    );
  } catch (error) {
    console.error("Database connection error:", error);

    if (error?.code === "P1001") {
      return (
        <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
          {/* Error Handling */}
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
            <h2 className="font-semibold text-lg">Database Connection Error</h2>
            <p className="text-sm">
              Unable to connect to the database. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        {/* Error Handling */}
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
          <h2 className="font-semibold text-lg">Error</h2>
          <p className="text-sm">
            An unexpected error occurred. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
