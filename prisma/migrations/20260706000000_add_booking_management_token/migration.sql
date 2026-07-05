-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "managementToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_managementToken_key" ON "Booking"("managementToken");
