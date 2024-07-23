import { Router } from 'express';
import { getColaboradores, createColaborador } from '../controllers/colaborador_controller';

const router = Router();

router.get('/', getColaboradores);
router.post('/', createColaborador);

export default router;
