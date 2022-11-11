import { Group } from '@prisma/client';
import { Request, Response } from 'express';
import FindAllGroupsUseCaseImpl from '../usecases/find-all-groups';

export default class GroupsController {
  async index(request: Request, response: Response): Promise<Response> {
    const useCase = new FindAllGroupsUseCaseImpl();
    const groups = await useCase.execute({});

    return response.json(groups);
  }
}
