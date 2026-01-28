/*
  Warnings:

  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "PurchasePayments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "SalesPayments_orderId_fkey";

-- DropTable
DROP TABLE "Payments";
