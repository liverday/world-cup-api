import { Group, Team } from '@prisma/client';
import { Request, Response } from 'express';
import Mapper from '../models/mappers/mapper';
import TeamMapper from '../models/mappers/team-mapper';
import { TeamResponse } from '../models/responses/team-response';
import FindAllGroupsUseCaseImpl from '../usecases/groups/find-all-groups';

export default class GroupsController {
  private teamOutputMapper: Mapper<any, TeamResponse>;

  constructor() {
    this.index = this.index.bind(this);
    this.teamOutputMapper = new TeamMapper();
  }

  async index(request: Request, response: Response): Promise<Response> {
    const useCase = new FindAllGroupsUseCaseImpl();
    const groups = await useCase.execute({});

    return response.json(
      groups.map(group => ({
        ...group,
        teams: group.teams.map(this.teamOutputMapper.mapToOutput),
      })),
    );
  }
}
