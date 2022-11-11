import { Router } from 'express';
import groupsRouter from './groups.routes';
import matchesRouter from './matches.routes';

const appRouter = Router();

appRouter.use('/groups', groupsRouter);
appRouter.use('/matches', matchesRouter);

export default appRouter;
