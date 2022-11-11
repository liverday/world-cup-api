import MatchesController from '@/application/controllers/matches.controller';
import { Router } from 'express';

const matchesRouter = Router();
const matchesController = new MatchesController();

matchesRouter.get('/', matchesController.index);

export default matchesRouter;
