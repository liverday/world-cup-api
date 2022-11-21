import DefaultScrapper from '@/application/scrappers/default-scrapper';
import Scrapper from '@/application/scrapper';
import prisma from '@/lib/prisma';
import axios from 'axios';
import Match from '../models/fifa/match';
import teamFifaIds from './assets/teams-fifa-ids.json';

const ROUTE_CODE = '15xDmWzQAu51lEIjP4fVfz';
const GROUPS_OVERVIEW_BASE_URL = `https://cxm-api.fifa.com/fifaplusweb/api/sections/tournamentGroupOverview/${ROUTE_CODE}`;
const COUNTRIES_BASE_URL = 'https://api.fifa.com/api/v3/countries';

type Team = {
  sourceId: string;
  sourceCategory: string;
  flatOrLogoUrl: string;
};

type Group = {
  groupTitle: string;
  groupIdentifier: string;
  teams: Team[];
};

type Country = {
  IdCountry: string;
  Name: string;
  Iso3166Alpha3: string;
};

async function scrapGroups() {
  const {
    data: { groups },
  } = await axios.get(GROUPS_OVERVIEW_BASE_URL);

  const promises = groups.map(async (group: Group) => {
    const { teams, groupIdentifier } = group;

    const parsedTeams = await Promise.all(
      teams.map(async (team: Team) => {
        const { data: country } = await axios.get<Country>(
          `${COUNTRIES_BASE_URL}/${team.sourceId}`,
        );

        return {
          country: team.sourceId,
          alternateName: country.Name,
          fifaCode: (teamFifaIds as any)[team.sourceId],
        };
      }),
    );

    await prisma.group.create({
      data: {
        code: groupIdentifier,
        teams: {
          createMany: {
            skipDuplicates: true,
            data: parsedTeams,
          },
        },
      },
    });
  });

  await Promise.all(promises);
}

const scrapper: Scrapper = new DefaultScrapper();

async function scrapMatches() {
  const matches = await scrapper.findAllMatches();

  const teamByFifaCode = await prisma.team.findMany().then(teams =>
    teams.reduce((accumulator, current) => {
      accumulator[current.fifaCode] = current;

      return accumulator;
    }, {} as any),
  );

  const promises = matches.map(async (match: Match) => {
    const awayTeamId = teamByFifaCode[match.AwayTeam?.IdTeam]?.id || null;
    const homeTeamId = teamByFifaCode[match.HomeTeam?.IdTeam]?.id || null;

    return prisma.match.create({
      data: {
        fifaId: match.IdMatch,
        fifaCompetitionId: match.IdCompetition,
        fifaGroupId: match.IdGroup,
        fifaStageId: match.IdStage,
        fifaSeasonId: match.IdSeason,
        date: match.Date,
        location: match.Stadium.CityName[0].Description,
        stageName: match.StageName[0].Description,
        status: 'scheduled',
        homeTeamId,
        awayTeamId,
      },
    });
  });

  await Promise.all(promises);
}

async function main() {
  await scrapGroups();
  await scrapMatches();
}

main();
