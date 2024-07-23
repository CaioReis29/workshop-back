import { Router } from 'express';
import { getAtas, createAta, addColaboradorToAta, removeColaboradorFromAta } from '../controllers/ata_controller';

const router = Router();

router.get('/', getAtas);
router.post('/', createAta);
router.put('/:ataId/colaboradores/:colaboradorId', addColaboradorToAta);
router.delete('/:ataId/colaboradores/:colaboradorId', removeColaboradorFromAta);

export default router;
