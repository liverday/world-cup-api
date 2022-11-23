/*
  Warnings:

  - You are about to drop the column `venue` on the `MatchStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "venue" TEXT;

-- AlterTable
ALTER TABLE "MatchStats" DROP COLUMN "venue";
