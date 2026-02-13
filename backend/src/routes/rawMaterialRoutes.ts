import { Router } from 'express';
import { createRawMaterial, getRawMaterials, getRawMaterial, updateRawMaterial, deleteRawMaterial } from '../controllers/rawMaterialController.js';

const router = Router();

router.post('/', createRawMaterial);
router.get('/', getRawMaterials);
router.get('/:id', getRawMaterial);
router.put('/:id', updateRawMaterial);
router.delete('/:id', deleteRawMaterial);

export default router;