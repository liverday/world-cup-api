import Bracket from '@/application/models/internal/bracket';
import UseCase from '@/application/usecase';
import { Match } from '@prisma/client';
import FindAllMatchesUseCaseImpl, {
  FindAllMatchesUseCase,
} from '../matches/find-all-matches';

type BuildBracketsRequest = Record<any, any>;

export type BuildBracketsUseCase = UseCase<BuildBracketsRequest, Bracket[]>;

export default class BuildBracketsUseCaseImpl implements BuildBracketsUseCase {
  private findAllMatchesUseCase: FindAllMatchesUseCase;

  constructor() {
    this.execute = this.execute.bind(this);
    this.findAllMatchesUseCase = new FindAllMatchesUseCaseImpl();
  }

  async execute(input: BuildBracketsRequest): Promise<Bracket[]> {
    const matches = await this.findAllMatchesUseCase.execute({});

    const matchIdByMatchNumber = matches
      .filter(match => match.stageName !== 'First stage')
      .reduce((accumulator, currentMatch: any) => {
        accumulator[currentMatch.fifaMatchNumber!] = currentMatch.id;

        return accumulator;
      }, {} as Record<string, string>);

    const matchesByStageName = matches
      .filter(match => match.stageName !== 'First stage')
      .reduce((accumulator, currentMatch) => {
        if (!accumulator[currentMatch.stageName]) {
          accumulator[currentMatch.stageName] = [];
        }

        accumulator[currentMatch.stageName].push(currentMatch);

        return accumulator;
      }, {} as Record<string, Match[]>);

    return Object.entries(matchesByStageName).map(([name, stageMatches]) => ({
      name,
      matches: stageMatches.map(match => ({
        ...match,
        parents: this.getParents(matchIdByMatchNumber, match),
      })),
    }));
  }

  getParents(
    matchIdByMatchNumber: Record<string, string>,
    match: Match,
  ): [string, string] | undefined {
    if (
      !match.fifaPlaceholderA?.startsWith('W') ||
      !match.fifaPlaceholderB?.startsWith('W')
    ) {
      return undefined;
    }
    const matchNumberA = parseInt(match.fifaPlaceholderA?.substring(1), 10);
    const matchNumberB = parseInt(match.fifaPlaceholderB?.substring(1), 10);

    return [
      matchIdByMatchNumber[matchNumberA],
      matchIdByMatchNumber[matchNumberB],
    ];
  }
}
