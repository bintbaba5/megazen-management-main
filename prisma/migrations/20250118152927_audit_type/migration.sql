/*
  Warnings:

  - Changed the type of `action` on the `Audits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('Transfer', 'Movement', 'Others');

-- AlterTable
ALTER TABLE "Audits" DROP COLUMN "action",
ADD COLUMN     "action" "AuditType" NOT NULL;
