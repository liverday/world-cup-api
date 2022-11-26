import { getItem, saveItem } from '@/lib/cache';
import { Request, Response } from 'express';
import Mapper from '../models/mappers/mapper';
import MatchMapper from '../models/mappers/match-mapper';
import TeamMapper from '../models/mappers/team-mapper';
import TeamResponse from '../models/responses/team-response';
import FindAllGroupsUseCaseImpl from '../usecases/groups/find-all-groups';

export default class GroupsController {
  private teamOutputMapper: Mapper<any, TeamResponse>;

  constructor() {
    this.index = this.index.bind(this);
    this.teamOutputMapper = new TeamMapper(new MatchMapper());
  }

  async index(request: Request, response: Response): Promise<Response> {
    const cachedGroups = await getItem('groups');

    if (cachedGroups) {
      return response.json(cachedGroups);
    }

    const useCase = new FindAllGroupsUseCaseImpl();
    const groups = await useCase.execute({});

    const groupsResponse = groups.map(group => ({
      ...group,
      teams: group.teams.map(this.teamOutputMapper.mapToOutput),
    }));

    saveItem('groups', groupsResponse);

    return response.json(groupsResponse);
  }
}
