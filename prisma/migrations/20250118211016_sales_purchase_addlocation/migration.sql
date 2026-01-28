/*
  Warnings:

  - Added the required column `locationId` to the `PurchaseOrderLineItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `SalesOrderLineItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseOrderLineItems" ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrderLineItems" ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SalesOrderLineItems" ADD CONSTRAINT "SalesOrderLineItems_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLineItems" ADD CONSTRAINT "PurchaseOrderLineItems_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;
