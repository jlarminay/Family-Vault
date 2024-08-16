-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "location" TEXT,
ADD COLUMN     "locationCity" TEXT,
ADD COLUMN     "locationCountry" TEXT,
ADD COLUMN     "locationEstimate" BOOLEAN NOT NULL DEFAULT false;
