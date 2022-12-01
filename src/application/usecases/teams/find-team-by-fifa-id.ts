import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Team } from '@prisma/client';

type FindTeamByFifaIdRequest = {
  fifaId: string;
};

type TeamResponse = Team | null;

export type FindTeamByFifaIdUseCase = UseCase<
  FindTeamByFifaIdRequest,
  TeamResponse | null
>;

export default class FindTeamByFifaIdUseCaseImpl
  implements FindTeamByFifaIdUseCase
{
  async execute({
    fifaId,
  }: FindTeamByFifaIdRequest): Promise<TeamResponse | null> {
    const [foundCountry] = await prisma.team.findMany({
      where: {
        fifaCode: fifaId,
      },
      include: {
        group: {
          select: {
            code: true,
          },
        },
      },
    });

    return foundCountry;
  }
}
