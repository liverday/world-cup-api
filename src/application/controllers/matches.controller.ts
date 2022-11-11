import { Request, Response } from 'express';
import FindAllMatchesUseCaseImpl from '../usecases/find-all-matches';

export default class MatchesController {
  async index(request: Request, response: Response): Promise<Response> {
    const useCase = new FindAllMatchesUseCaseImpl();
    const matches = await useCase.execute({});

    return response.json(matches);
  }
}
