import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct, getProduct, getProductionSuggestion } from '../controllers/productController.js';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/production/suggestion', getProductionSuggestion);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
