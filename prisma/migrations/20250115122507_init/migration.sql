/*
  Warnings:

  - You are about to drop the column `status` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `expectedDeliveryDate` on the `Purchases` table. All the data in the column will be lost.
  - Added the required column `paymentStatus` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `orderType` on the `Payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('SALES', 'PURCHASE');

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentReference" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "orderType",
ADD COLUMN     "orderType" "OrderType" NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrderLineItems" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "unitPrice" SET DEFAULT 0.0,
ALTER COLUMN "totalPrice" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "expectedDeliveryDate",
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
ALTER COLUMN "totalAmount" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Sales" ALTER COLUMN "totalAmount" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "SalesOrderLineItems" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "unitPrice" SET DEFAULT 0.0,
ALTER COLUMN "totalPrice" SET DEFAULT 0.0;
