/*
  Warnings:

  - You are about to drop the column `location` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `locationCity` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `locationCountry` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `locationEstimate` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "location",
DROP COLUMN "locationCity",
DROP COLUMN "locationCountry",
DROP COLUMN "locationEstimate",
ADD COLUMN     "locationId" INTEGER;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "latLong" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
