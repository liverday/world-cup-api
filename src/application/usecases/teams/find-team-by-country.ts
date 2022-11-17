import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { notFound } from '@/application/error/app-error';
import { Team } from '@prisma/client';

type FindTeamByCountryRequest = {
  country: string;
};

type TeamResponse = Team | null;

export type FindTeamByCountryUseCase = UseCase<
  FindTeamByCountryRequest,
  TeamResponse
>;

export default class FindTeamByCountryUseCaseImpl
  implements FindTeamByCountryUseCase
{
  async execute({ country }: FindTeamByCountryRequest): Promise<TeamResponse> {
    const foundCountry = await prisma.team.findUnique({
      where: {
        country: country.toUpperCase(),
      },
    });

    if (!foundCountry) {
      throw notFound(`Country ${country} not found`);
    }

    return foundCountry;
  }
}
