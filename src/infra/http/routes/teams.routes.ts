import TeamsController from '@/application/controllers/teams.controller';
import { Router } from 'express';

const teamsRouter = Router();
const teamsController = new TeamsController();

teamsRouter.get('/:country', teamsController.showByCountry);

export default teamsRouter;
