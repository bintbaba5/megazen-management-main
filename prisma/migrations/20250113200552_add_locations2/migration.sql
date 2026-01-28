/*
  Warnings:

  - You are about to drop the `_InventoryToLocations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InventoryToLocations" DROP CONSTRAINT "_InventoryToLocations_A_fkey";

-- DropForeignKey
ALTER TABLE "_InventoryToLocations" DROP CONSTRAINT "_InventoryToLocations_B_fkey";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "quantity" SET DEFAULT 0;

-- DropTable
DROP TABLE "_InventoryToLocations";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;
