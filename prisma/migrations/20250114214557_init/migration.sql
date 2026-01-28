-- RenameForeignKey
ALTER TABLE "Payments" RENAME CONSTRAINT "Payments_purchaseOrder_fkey" TO "PurchasePayments_orderId_fkey";

-- RenameForeignKey
ALTER TABLE "Payments" RENAME CONSTRAINT "Payments_salesOrder_fkey" TO "SalesPayments_orderId_fkey";
