/*
  Warnings:

  - You are about to drop the column `status` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignedAt` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseDate` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "status",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "enum" TEXT NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "code" TEXT DEFAULT 'EMPLOYEE',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Device_code_key" ON "Device"("code");
