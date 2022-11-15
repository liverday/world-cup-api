import { Request, Response } from 'express';
import FindTeamByCountryUseCaseImpl from '../usecases/teams/find-team-by-country';

export default class TeamsController {
  async showByCountry(request: Request, response: Response): Promise<Response> {
    const useCase = new FindTeamByCountryUseCaseImpl();
    const { country } = request.params;

    const foundCountry = await useCase.execute({ country });

    return response.json(foundCountry);
  }
}
