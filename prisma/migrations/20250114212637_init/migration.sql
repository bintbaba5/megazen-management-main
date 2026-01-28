-- RenameForeignKey
ALTER TABLE "Payments" RENAME CONSTRAINT "Payments_orderId_fkey" TO "Payments_salesOrder_fkey";
