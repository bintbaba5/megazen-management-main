/*
  Warnings:

  - You are about to drop the column `supplierName` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `supplierPhone` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `customerContact` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Sales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "supplierName",
DROP COLUMN "supplierPhone",
ADD COLUMN     "supplierId" INTEGER;

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "customerContact",
DROP COLUMN "customerName",
ADD COLUMN     "customerId" INTEGER;

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplierId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplierId")
);

-- CreateTable
CREATE TABLE "CreditTransactions" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "customerId" INTEGER,
    "supplierId" INTEGER,
    "saleId" INTEGER,
    "purchaseId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "CreditTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditBalance" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "customerId" INTEGER,
    "supplierId" INTEGER,

    CONSTRAINT "CreditBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditTransactions_customerId_idx" ON "CreditTransactions"("customerId");

-- CreateIndex
CREATE INDEX "CreditTransactions_supplierId_idx" ON "CreditTransactions"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_customerId_key" ON "CreditBalance"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_supplierId_key" ON "CreditBalance"("supplierId");

-- CreateIndex
CREATE INDEX "CreditBalance_customerId_idx" ON "CreditBalance"("customerId");

-- CreateIndex
CREATE INDEX "CreditBalance_supplierId_idx" ON "CreditBalance"("supplierId");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("supplierId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransactions" ADD CONSTRAINT "CreditTransactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransactions" ADD CONSTRAINT "CreditTransactions_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("supplierId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransactions" ADD CONSTRAINT "CreditTransactions_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sales"("saleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransactions" ADD CONSTRAINT "CreditTransactions_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchases"("purchaseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditBalance" ADD CONSTRAINT "CreditBalance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditBalance" ADD CONSTRAINT "CreditBalance_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("supplierId") ON DELETE CASCADE ON UPDATE CASCADE;
