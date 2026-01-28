/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `inventoryId` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `inventoryId` on the `Audits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Audits" DROP CONSTRAINT "Audits_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Audits" DROP COLUMN "inventoryId",
ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_pkey",
DROP COLUMN "inventoryId",
ADD COLUMN     "inventoryId" SERIAL NOT NULL,
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventoryId");

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
