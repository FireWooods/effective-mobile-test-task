import express from 'express';

import ActionsController from '../controller/action_controller';

const router = express();
const controller = new ActionsController();

router.post('/actions', controller.getActions);
router.get('/actions', controller.getActionsByFilter);

export default router;
