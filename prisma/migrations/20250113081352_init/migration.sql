/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `PurchaseOrderLineItems` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `SalesOrderLineItems` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `PurchaseOrderLineItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `SalesOrderLineItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderLineItems" DROP CONSTRAINT "PurchaseOrderLineItems_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrderLineItems" DROP CONSTRAINT "SalesOrderLineItems_productVariantId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "imageUrl",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "PurchaseOrderLineItems" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrderLineItems" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductVariants";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderLineItems" ADD CONSTRAINT "SalesOrderLineItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLineItems" ADD CONSTRAINT "PurchaseOrderLineItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
