import MatchesController from '@/application/controllers/matches.controller';
import TeamsController from '@/application/controllers/teams.controller';
import { Router } from 'express';

const teamsRouter = Router();
const teamsController = new TeamsController();
const matchesController = new MatchesController();

teamsRouter.get('/:country', teamsController.showByCountry);
teamsRouter.get('/:country/matches', matchesController.showByCountry);

export default teamsRouter;
