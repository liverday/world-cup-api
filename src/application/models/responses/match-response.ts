import { OfficialResponse } from '../fifa/official';
import { PlayerResponse } from '../fifa/player';
import { SubstitutionResponse } from '../fifa/substitution';
import EventResponse from './event-response';

export type MatchStatsResponse = {
  attemptsOnGoal: number | null;
  kicksOnTarget: number | null;
  kicksOffTarget: number | null;
  kicksBlocked: number | null;
  kicksOnWoodwork: number | null;
  corners: number | null;
  offsides: number | null;
  ballPossession: number | null;
  passes: number | null;
  passesCompleted: number | null;
  distanceCovered: number | null;
  freeKicks: number | null;
  crosses: number | null;
  crossesCompleted: number | null;
  assists: number | null;
  yellowCards: number | null;
  redCards: number | null;
  foulsCommited: number | null;
  foulsReceived: number | null;
  officials?: string;
  startingPlayers?: string;
  coaches?: string;
  substitutes?: string;
  tactics: string | null;
};

export default interface MatchResponse {
  id: string;
  location: string;
  status: string;
  stageName: string;
  date: Date;
  time: string | null;
  timeExtraInfo?: {
    current: string | null;
    firstHalfTime: string | null;
    firstHalfExtraTime: string | null;
    secondHalfTime: string | null;
    secondHalfExtraTime: string | null;
  };
  venue: string | null;
  homeTeam: {
    country: string;
    name: string;
    goals: number;
    penalties: number;
    statistics?: MatchStatsResponse;
    startingPlayers?: PlayerResponse[];
    substitutions?: SubstitutionResponse[];
    events: EventResponse[];
  };
  awayTeam: {
    country: string;
    name: string;
    goals: number;
    penalties: number;
    statistics?: MatchStatsResponse;
    startingPlayers?: PlayerResponse[];
    substitutions?: SubstitutionResponse[];
    events: EventResponse[];
  };
  officials?: OfficialResponse[];
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}
