import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
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
    return prisma.team.findUnique({
      where: {
        country,
      },
    });
  }
}
