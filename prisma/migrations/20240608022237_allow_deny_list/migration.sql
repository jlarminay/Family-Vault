-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "isAllowList" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isBlockList" BOOLEAN NOT NULL DEFAULT false;
