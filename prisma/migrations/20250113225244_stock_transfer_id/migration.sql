/*
  Warnings:

  - The primary key for the `StockMovements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `movementId` column on the `StockMovements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StockTransfers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `transferId` column on the `StockTransfers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StockMovements" DROP CONSTRAINT "StockMovements_pkey",
DROP COLUMN "movementId",
ADD COLUMN     "movementId" SERIAL NOT NULL,
ADD CONSTRAINT "StockMovements_pkey" PRIMARY KEY ("movementId");

-- AlterTable
ALTER TABLE "StockTransfers" DROP CONSTRAINT "StockTransfers_pkey",
DROP COLUMN "transferId",
ADD COLUMN     "transferId" SERIAL NOT NULL,
ADD CONSTRAINT "StockTransfers_pkey" PRIMARY KEY ("transferId");
