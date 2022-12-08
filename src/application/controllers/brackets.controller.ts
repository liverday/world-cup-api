import { Request, Response } from 'express';
import Mapper from '../models/mappers/mapper';
import MatchMapper from '../models/mappers/match-mapper';
import MatchResponse from '../models/responses/match-response';
import BuildBracketsUseCaseImpl, {
  BuildBracketsUseCase,
} from '../usecases/brackets/build-brackets';

export default class BracketsController {
  private matchMapper: Mapper<any, MatchResponse>;

  private buildBracketsUseCase: BuildBracketsUseCase;

  constructor() {
    this.matchMapper = new MatchMapper();
    this.buildBracketsUseCase = new BuildBracketsUseCaseImpl();
    this.index = this.index.bind(this);
  }

  async index(_: Request, response: Response): Promise<Response> {
    const brackets = await this.buildBracketsUseCase.execute({});

    return response.json(
      brackets.map(({ name, matches }) => ({
        name,
        matches: matches.map(this.matchMapper.mapToOutput),
      })),
    );
  }
}
