/*
  Warnings:

  - You are about to drop the column `attempsOnGoal` on the `MatchStats` table. All the data in the column will be lost.
  - You are about to drop the column `attendance` on the `MatchStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "attendance" TEXT;

-- AlterTable
ALTER TABLE "MatchStats" DROP COLUMN "attempsOnGoal",
DROP COLUMN "attendance",
ADD COLUMN     "attemptsOnGoal" INTEGER,
ALTER COLUMN "ballPossession" SET DATA TYPE DOUBLE PRECISION;
