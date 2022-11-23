/*
  Warnings:

  - You are about to drop the column `officials` on the `MatchStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "officials" JSONB;

-- AlterTable
ALTER TABLE "MatchStats" DROP COLUMN "officials";
