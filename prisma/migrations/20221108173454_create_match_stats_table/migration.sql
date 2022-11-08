-- CreateTable
CREATE TABLE "MatchStats" (
    "teamId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "attempsOnGoal" INTEGER NOT NULL,
    "kicksOnTarget" INTEGER NOT NULL,
    "kicksOffTarget" INTEGER NOT NULL,
    "kicksBlocked" INTEGER NOT NULL,
    "kicksOnWoodwork" INTEGER NOT NULL,
    "corners" INTEGER NOT NULL,
    "offsides" INTEGER NOT NULL,
    "ballPossession" INTEGER NOT NULL,
    "passAccuracy" INTEGER NOT NULL,
    "passes" INTEGER NOT NULL,
    "passesCompleted" INTEGER NOT NULL,
    "distanceCovered" INTEGER NOT NULL,
    "ballsRecovered" INTEGER NOT NULL,
    "tackles" INTEGER NOT NULL,
    "clearances" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "foulsCommited" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchStats_pkey" PRIMARY KEY ("teamId","matchId")
);

-- AddForeignKey
ALTER TABLE "MatchStats" ADD CONSTRAINT "MatchStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchStats" ADD CONSTRAINT "MatchStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
