import { getItem, saveItem } from '@/lib/cache';
import { Request, Response } from 'express';
import { notFound } from '../error/app-error';
import Mapper from '../models/mappers/mapper';
import MatchMapper from '../models/mappers/match-mapper';
import MatchResponse from '../models/responses/match-response';
import FindAllMatchesUseCaseImpl from '../usecases/matches/find-all-matches';
import FindCurrentMatchUseCaseImpl from '../usecases/matches/find-current-match';
import FindMatchByIdUseCaseImpl from '../usecases/matches/find-match-by-id';
import FindMatchesByContryUseCaseImpl from '../usecases/matches/find-matches-by-country';
import FindTodayMatchesUseCaseImpl from '../usecases/matches/find-today-matches';

export default class MatchesController {
  private outputMapper: Mapper<any, MatchResponse> = new MatchMapper();

  constructor() {
    this.index = this.index.bind(this);
    this.showById = this.showById.bind(this);
    this.todaysMatches = this.todaysMatches.bind(this);
    this.currentMatch = this.currentMatch.bind(this);
    this.showByCountry = this.showByCountry.bind(this);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const cachedMatches = await getItem('all_matches');

    if (cachedMatches) {
      return response.json(cachedMatches);
    }

    const useCase = new FindAllMatchesUseCaseImpl();

    const matches = await useCase.execute({});
    const matchesResponse = matches.map(this.outputMapper.mapToOutput);

    saveItem('all_matches', matchesResponse);

    return response.json(matchesResponse);
  }

  async showById(request: Request, response: Response): Promise<Response> {
    const useCase = new FindMatchByIdUseCaseImpl();
    const { id: matchId } = request.params;
    const foundMatch = await useCase.execute({ matchId });

    if (!foundMatch) {
      throw notFound('Match not found');
    }

    return response.json(this.outputMapper.mapToOutput(foundMatch));
  }

  async todaysMatches(request: Request, response: Response): Promise<Response> {
    const useCase = new FindTodayMatchesUseCaseImpl();
    const matches = await useCase.execute({});

    return response.json(matches.map(this.outputMapper.mapToOutput));
  }

  async currentMatch(_: Request, response: Response): Promise<Response> {
    const useCase = new FindCurrentMatchUseCaseImpl();
    const match = await useCase.execute({});

    return response.json(this.outputMapper.mapToOutput(match));
  }

  async showByCountry(request: Request, response: Response): Promise<Response> {
    const { country } = request.params;
    const cacheKey = `matches_by_country_${country}`;
    const cachedMatches = await getItem(cacheKey);

    if (cachedMatches) {
      return response.json(cachedMatches);
    }

    const useCase = new FindMatchesByContryUseCaseImpl();
    const matches = await useCase.execute({ country: country.toUpperCase() });
    const matchesResponse = matches.map(this.outputMapper.mapToOutput);

    saveItem(cacheKey, matchesResponse);

    return response.json(matchesResponse);
  }
}
