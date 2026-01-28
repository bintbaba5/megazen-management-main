/*
  Warnings:

  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `productId` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `productId` on the `ProductVariants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `StockMovements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_productId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovements" DROP CONSTRAINT "StockMovements_productId_fkey";

-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "productId",
ADD COLUMN     "productId" SERIAL NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("productId");

-- AlterTable
ALTER TABLE "StockMovements" DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovements" ADD CONSTRAINT "StockMovements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
