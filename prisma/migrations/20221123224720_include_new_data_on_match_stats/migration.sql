/*
  Warnings:

  - You are about to drop the column `ballsRecovered` on the `MatchStats` table. All the data in the column will be lost.
  - You are about to drop the column `clearances` on the `MatchStats` table. All the data in the column will be lost.
  - You are about to drop the column `passAccuracy` on the `MatchStats` table. All the data in the column will be lost.
  - You are about to drop the column `tackles` on the `MatchStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchStats" DROP COLUMN "ballsRecovered",
DROP COLUMN "clearances",
DROP COLUMN "passAccuracy",
DROP COLUMN "tackles",
ADD COLUMN     "assists" INTEGER,
ADD COLUMN     "crosses" INTEGER,
ADD COLUMN     "crossesCompleted" INTEGER,
ADD COLUMN     "foulsReceived" INTEGER,
ADD COLUMN     "freeKicks" INTEGER,
ALTER COLUMN "distanceCovered" SET DATA TYPE DOUBLE PRECISION;
