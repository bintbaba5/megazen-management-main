/*
  Warnings:

  - The primary key for the `PurchaseOrderLineItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseOrderLineItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Purchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `purchaseId` column on the `Purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Sales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `saleId` column on the `Sales` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SalesOrderLineItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SalesOrderLineItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PurchasePayments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesPayments` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `purchaseOrderId` on the `PurchaseOrderLineItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `salesOrderId` on the `SalesOrderLineItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrderLineItems" DROP CONSTRAINT "PurchaseOrderLineItems_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasePayments" DROP CONSTRAINT "PurchasePayments_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrderLineItems" DROP CONSTRAINT "SalesOrderLineItems_salesOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SalesPayments" DROP CONSTRAINT "SalesPayments_salesOrderId_fkey";

-- AlterTable
ALTER TABLE "PurchaseOrderLineItems" DROP CONSTRAINT "PurchaseOrderLineItems_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "purchaseOrderId",
ADD COLUMN     "purchaseOrderId" INTEGER NOT NULL,
ADD CONSTRAINT "PurchaseOrderLineItems_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_pkey",
DROP COLUMN "purchaseId",
ADD COLUMN     "purchaseId" SERIAL NOT NULL,
ADD CONSTRAINT "Purchases_pkey" PRIMARY KEY ("purchaseId");

-- AlterTable
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_pkey",
DROP COLUMN "saleId",
ADD COLUMN     "saleId" SERIAL NOT NULL,
ADD CONSTRAINT "Sales_pkey" PRIMARY KEY ("saleId");

-- AlterTable
ALTER TABLE "SalesOrderLineItems" DROP CONSTRAINT "SalesOrderLineItems_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "salesOrderId",
ADD COLUMN     "salesOrderId" INTEGER NOT NULL,
ADD CONSTRAINT "SalesOrderLineItems_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "PurchasePayments";

-- DropTable
DROP TABLE "SalesPayments";

-- CreateTable
CREATE TABLE "Payments" (
    "paymentId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderType" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentId")
);

-- AddForeignKey
ALTER TABLE "SalesOrderLineItems" ADD CONSTRAINT "SalesOrderLineItems_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLineItems" ADD CONSTRAINT "PurchaseOrderLineItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "Purchases"("purchaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_purchaseOrder_fkey" FOREIGN KEY ("orderId") REFERENCES "Purchases"("purchaseId") ON DELETE RESTRICT ON UPDATE CASCADE;
