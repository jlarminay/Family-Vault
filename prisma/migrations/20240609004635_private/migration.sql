/*
  Warnings:

  - You are about to drop the column `isAllowList` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `isBlockList` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "isAllowList",
DROP COLUMN "isBlockList",
ALTER COLUMN "published" SET DEFAULT 'private',
ALTER COLUMN "published" SET DATA TYPE TEXT;
