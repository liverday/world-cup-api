import BracketsController from '@/application/controllers/brackets.controller';
import { Router } from 'express';

const bracketsRouter = Router();
const bracketsController = new BracketsController();

bracketsRouter.get('/', bracketsController.index);

export default bracketsRouter;
