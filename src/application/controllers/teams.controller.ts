import { Request, Response } from 'express';
import Mapper from '../models/mappers/mapper';
import TeamMapper from '../models/mappers/team-mapper';
import { TeamResponse } from '../models/responses/team-response';
import FindTeamByCountryUseCaseImpl from '../usecases/teams/find-team-by-country';

export default class TeamsController {
  private outputMapper: Mapper<any, TeamResponse>;

  constructor() {
    this.outputMapper = new TeamMapper();
    this.showByCountry = this.showByCountry.bind(this);
  }

  async showByCountry(request: Request, response: Response): Promise<Response> {
    const useCase = new FindTeamByCountryUseCaseImpl();
    const { country } = request.params;

    const foundCountry = await useCase.execute({
      country: country.toUpperCase(),
    });

    return response.json(this.outputMapper.mapToOutput(foundCountry));
  }
}
