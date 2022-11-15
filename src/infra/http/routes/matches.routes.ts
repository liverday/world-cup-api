import MatchesController from '@/application/controllers/matches.controller';
import { Router } from 'express';

const matchesRouter = Router();
const matchesController = new MatchesController();

matchesRouter.get('/', matchesController.index);
matchesRouter.get('/today', matchesController.todaysMatches);
matchesRouter.get('/:id', matchesController.showById);

export default matchesRouter;
