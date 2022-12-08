import { Router } from 'express';
import bracketsRouter from './brackets.routes';

import groupsRouter from './groups.routes';
import matchesRouter from './matches.routes';
import teamsRouter from './teams.routes';

const appRouter = Router();

appRouter.use('/groups', groupsRouter);
appRouter.use('/matches', matchesRouter);
appRouter.use('/teams', teamsRouter);
appRouter.use('/brackets', bracketsRouter);

export default appRouter;
