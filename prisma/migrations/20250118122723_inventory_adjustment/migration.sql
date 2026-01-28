/*
  Warnings:

  - The primary key for the `Audits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Audits` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `Audits` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `StockMovements` table. All the data in the column will be lost.
  - You are about to drop the column `destinationLocationId` on the `StockTransfers` table. All the data in the column will be lost.
  - You are about to drop the column `sourceLocationId` on the `StockTransfers` table. All the data in the column will be lost.
  - Added the required column `inventoryId` to the `StockMovements` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `StockMovements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `destinationInventoryId` to the `StockTransfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceInventoryId` to the `StockTransfers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('SALES', 'PURCHASE', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "Audits" DROP CONSTRAINT "Audits_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovements" DROP CONSTRAINT "StockMovements_productId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfers" DROP CONSTRAINT "StockTransfers_destinationLocationId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfers" DROP CONSTRAINT "StockTransfers_sourceLocationId_fkey";

-- AlterTable
ALTER TABLE "Audits" DROP CONSTRAINT "Audits_pkey",
DROP COLUMN "id",
DROP COLUMN "warehouseId",
ADD COLUMN     "auditId" SERIAL NOT NULL,
ALTER COLUMN "oldQuantity" DROP NOT NULL,
ALTER COLUMN "inventoryId" DROP NOT NULL,
ADD CONSTRAINT "Audits_pkey" PRIMARY KEY ("auditId");

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "isLowStock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lowStockLevel" INTEGER;

-- AlterTable
ALTER TABLE "StockMovements" DROP COLUMN "productId",
ADD COLUMN     "auditId" INTEGER,
ADD COLUMN     "inventoryId" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "StockTransfers" DROP COLUMN "destinationLocationId",
DROP COLUMN "sourceLocationId",
ADD COLUMN     "auditId" INTEGER,
ADD COLUMN     "destinationInventoryId" INTEGER NOT NULL,
ADD COLUMN     "sourceInventoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "StockTransfers_sourceInventoryId_destinationInventoryId_idx" ON "StockTransfers"("sourceInventoryId", "destinationInventoryId");

-- AddForeignKey
ALTER TABLE "StockMovements" ADD CONSTRAINT "StockMovements_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovements" ADD CONSTRAINT "StockMovements_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("auditId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_sourceInventoryId_fkey" FOREIGN KEY ("sourceInventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_destinationInventoryId_fkey" FOREIGN KEY ("destinationInventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfers" ADD CONSTRAINT "StockTransfers_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("auditId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE SET NULL ON UPDATE CASCADE;
