import { Router } from 'express';
import { getWorkshops, createWorkshop, getWorkshopById } from '../controllers/workshop_controller';

const router = Router();

router.get('/', getWorkshops);
router.post('/', createWorkshop);
router.post('/:id', getWorkshopById);

export default router;
