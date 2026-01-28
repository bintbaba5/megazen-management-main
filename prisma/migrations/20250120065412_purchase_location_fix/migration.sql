/*
  Warnings:

  - You are about to drop the column `locationId` on the `PurchaseOrderLineItems` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrderLineItems" DROP CONSTRAINT "PurchaseOrderLineItems_locationId_fkey";

-- AlterTable
ALTER TABLE "PurchaseOrderLineItems" DROP COLUMN "locationId";

-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;
