import { Event, Match, MatchStats, Team } from '@prisma/client';
import Official, { OfficialResponse } from '../fifa/official';
import Player, { PlayerResponse } from '../fifa/player';
import { Substitution, SubstitutionResponse } from '../fifa/substitution';
import EventResponse from '../responses/event-response';
import MatchResponse, { MatchStatsResponse } from '../responses/match-response';
import Mapper from './mapper';

type MatchInput = Match & {
  homeTeam: TeamAndStats;
  awayTeam: TeamAndStats;
  winner: Team | null;
  parents?: [string, string];
};

type TeamAndStats = Team & {
  matchStats: MatchStats[];
  events: Event[];
};

export default class MatchMapper implements Mapper<MatchInput, MatchResponse> {
  constructor() {
    this.mapToOutput = this.mapToOutput.bind(this);
    this.mapOfficials = this.mapOfficials.bind(this);
    this.mapStats = this.mapStats.bind(this);
    this.mapPlayers = this.mapPlayers.bind(this);
    this.mapSubstitutions = this.mapSubstitutions.bind(this);
  }

  mapToOutput(input: MatchInput): MatchResponse {
    const homeStats = input.homeTeam?.matchStats?.[0];
    const awayStats = input.awayTeam?.matchStats?.[0];
    const homeEvents = input.homeTeam?.events;
    const awayEvents = input.awayTeam?.events;

    return {
      id: input.id,
      venue: input.venue,
      location: input.location,
      status: input.status,
      stageName: input.stageName,
      time:
        input.time === "0'" && input.status === 'completed'
          ? 'finished'
          : input.time,
      timeExtraInfo: {
        current: input.time,
        firstHalfTime: input.firstHalfTime,
        firstHalfExtraTime: input.firstHalfExtraTime,
        secondHalfTime: input.secondHalfTime,
        secondHalfExtraTime: input.secondHalfExtraTime,
      },
      homeTeam:
        (input.homeTeam && {
          country: input.homeTeam?.country,
          goals: input.homeTeamScore ?? 0,
          name: input.homeTeam?.alternateName,
          penalties: input.homeTeamPenalties ?? 0,
          statistics: homeStats && this.mapStats(homeStats),
          substitutions:
            homeStats &&
            this.mapSubstitutions(
              homeStats.startingPlayers as any,
              homeStats.substitutes as any,
            ),
          events: homeEvents && this.mapEvents(homeEvents),
          startingPlayers:
            homeStats && this.mapPlayers(homeStats.startingPlayers as any),
        }) ??
        input.fifaPlaceholderA,
      awayTeam:
        (input.awayTeam && {
          country: input.awayTeam.country,
          goals: input.awayTeamScore ?? 0,
          name: input.awayTeam.alternateName,
          penalties: input.awayTeamPenalties ?? 0,
          statistics: awayStats && this.mapStats(awayStats),
          substitutions:
            awayStats &&
            this.mapSubstitutions(
              awayStats.startingPlayers as any,
              awayStats.substitutes as any,
            ),
          events: awayEvents && this.mapEvents(awayEvents),
          startingPlayers:
            awayStats && this.mapPlayers(awayStats.startingPlayers as any),
        }) ??
        input.fifaPlaceholderB,
      officials: this.mapOfficials(input.officials as any[]),
      createdAt: input.createdAt,
      date: input.date,
      updatedAt: input.updatedAt,
      winner: input.winner?.alternateName,
      parents: input.parents,
      matchNumber: input.fifaMatchNumber,
    };
  }

  mapStats(stats: MatchStats): MatchStatsResponse {
    return {
      attemptsOnGoal: stats.attemptsOnGoal,
      kicksOnTarget: stats.kicksOnTarget,
      kicksOffTarget: stats.kicksOffTarget,
      kicksBlocked: stats.kicksBlocked,
      kicksOnWoodwork: stats.kicksOnWoodwork,
      corners: stats.corners,
      offsides: stats.offsides,
      ballPossession: stats.ballPossession,
      passes: stats.passes,
      passesCompleted: stats.passesCompleted,
      distanceCovered: stats.distanceCovered,
      freeKicks: stats.freeKicks,
      crosses: stats.crosses,
      crossesCompleted: stats.crossesCompleted,
      assists: stats.assists,
      yellowCards: stats.yellowCards,
      redCards: stats.redCards,
      foulsCommited: stats.foulsCommited,
      foulsReceived: stats.foulsReceived,
      tactics: stats.tactics,
    };
  }

  mapOfficials(officials: Official[]): OfficialResponse[] | undefined {
    return (
      officials?.map(official => ({
        name: official.Name[0].Description,
        role: official.TypeLocalized[0].Description,
        country: official.IdCountry,
      })) ?? undefined
    );
  }

  mapPlayers(players: Player[]): PlayerResponse[] {
    return players
      .filter(player => player.Status === 1)
      .map(this.mapPlayer.bind(this));
  }

  mapPlayer(player: Player): PlayerResponse {
    return {
      name: player.PlayerName[0].Description,
      number: player.ShirtNumber,
      position: this.mapPlayerPosition(player.Position),
    };
  }

  mapSubstitutions(
    players: Player[],
    substitutes: Substitution[],
  ): SubstitutionResponse[] {
    const playersById = players.reduce((accumulator, current) => {
      accumulator[current.IdPlayer] = current;

      return accumulator;
    }, {} as any);

    return substitutes.map(substitute => {
      const playerIn = playersById[substitute.IdPlayerOn];
      const playerOut = playersById[substitute.IdPlayerOff];

      return {
        minute: substitute.Minute,
        playerIn: this.mapPlayer(playerIn),
        playerOut: this.mapPlayer(playerOut),
      };
    });
  }

  mapPlayerPosition(playerPosition: number): string | null {
    const positionDictionary: {
      [key: number]: string;
    } = {
      0: 'Goalkeeper',
      1: 'Defender',
      2: 'Midfield',
      3: 'Forward',
    };

    return positionDictionary[playerPosition] ?? 'Undefined';
  }

  mapEvents(events: Event[]): EventResponse[] {
    return events.map(({ typeOfEvent, player, extraInfo, time }) => ({
      typeOfEvent,
      player,
      extraInfo,
      minute: time,
    }));
  }
}
