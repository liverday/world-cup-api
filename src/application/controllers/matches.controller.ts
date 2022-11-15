import { Request, Response } from 'express';
import { notFound } from '../error/app-error';
import FindAllMatchesUseCaseImpl from '../usecases/ matches/find-all-matches';
import FindMatchByIdUseCaseImpl from '../usecases/ matches/find-match-by-id';
import FindTodayMatchesUseCaseImpl from '../usecases/ matches/find-today-matches';

export default class MatchesController {
  async index(request: Request, response: Response): Promise<Response> {
    const useCase = new FindAllMatchesUseCaseImpl();
    const matches = await useCase.execute({});

    return response.json(matches);
  }

  async showById(request: Request, response: Response): Promise<Response> {
    const useCase = new FindMatchByIdUseCaseImpl();
    const { id: matchId } = request.params;
    const foundMatch = await useCase.execute({ matchId });

    if (!foundMatch) {
      throw notFound('Match not found');
    }

    return response.json(foundMatch);
  }

  async todaysMatches(request: Request, response: Response): Promise<Response> {
    const useCase = new FindTodayMatchesUseCaseImpl();
    const matches = await useCase.execute({});

    return response.json(matches);
  }
}
