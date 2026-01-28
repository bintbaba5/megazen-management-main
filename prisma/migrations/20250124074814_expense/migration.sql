/*
  Warnings:

  - You are about to drop the `Expences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Expences";

-- CreateTable
CREATE TABLE "Expenses" (
    "expenseId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expenseId")
);
