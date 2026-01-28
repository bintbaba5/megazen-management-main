-- CreateTable
CREATE TABLE "Expences" (
    "expenceId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Expences_pkey" PRIMARY KEY ("expenceId")
);
