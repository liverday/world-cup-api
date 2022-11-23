import { MatchStats } from '@prisma/client';

const fifaStatsKeyDictionary: {
  [k: string]: keyof MatchStats;
} = {
  TotalDistance: 'distanceCovered',
  AttemptAtGoalInsideThePenaltyArea: 'kicksOnWoodwork',
  AttemptAtGoalOnTarget: 'kicksOnTarget',
  AttemptAtGoalOffTarget: 'kicksOffTarget',
  AttemptAtGoalBlocked: 'kicksBlocked',
  AttemptAtGoal: 'attemptsOnGoal',
  Corners: 'corners',
  Offsides: 'offsides',
  Passes: 'passes',
  RedCards: 'redCards',
  YellowCards: 'yellowCards',
  PassessCompleted: 'passesCompleted',
  FreeKicks: 'freeKicks',
  Crosses: 'crosses',
  CrossesCompleted: 'crossesCompleted',
  Assists: 'assists',
  FoulsFor: 'foulsReceived',
  FoulsAgains: 'foulsCommited',
};

export default fifaStatsKeyDictionary;
