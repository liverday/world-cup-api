import GroupsController from '@/application/controllers/groups.controller';
import { Router } from 'express';

const groupsRouter = Router();
const groupsController = new GroupsController();

groupsRouter.get('/', groupsController.index);

export default groupsRouter;
