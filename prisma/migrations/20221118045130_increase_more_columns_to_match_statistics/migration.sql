-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "awayTeamPenalties" INTEGER,
ADD COLUMN     "firstHalfExtraTime" TEXT,
ADD COLUMN     "firstHalfTime" TEXT,
ADD COLUMN     "homeTeamPenalties" INTEGER,
ADD COLUMN     "secondHalfExtraTime" TEXT,
ADD COLUMN     "secondHalfTime" TEXT,
ADD COLUMN     "time" TEXT;
