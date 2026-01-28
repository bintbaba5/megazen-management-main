/*
  Warnings:

  - You are about to drop the column `shopStock` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseStock` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,locationId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Inventory_productId_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "shopStock",
DROP COLUMN "warehouseStock",
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "StockTransfers" (
    "transferId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sourceLocationId" INTEGER NOT NULL,
    "destinationLocationId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockTransfers_pkey" PRIMARY KEY ("transferId")
);

-- CreateTable
CREATE TABLE "Locations" (
    "locationId" SERIAL NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationAddress" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "_InventoryToLocations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InventoryToLocations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InventoryToLocations_B_index" ON "_InventoryToLocations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_locationId_key" ON "Inventory"("productId", "locationId");

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_sourceLocationId_fkey" FOREIGN KEY ("sourceLocationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_destinationLocationId_fkey" FOREIGN KEY ("destinationLocationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToLocations" ADD CONSTRAINT "_InventoryToLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("inventoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToLocations" ADD CONSTRAINT "_InventoryToLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Locations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;
