import { Router } from 'express';
import IdentifyController from '../controllers/identifyController';

const identifyController = new IdentifyController();
const router = Router();

router.use('/identify', identifyController.identify);

export default router;
