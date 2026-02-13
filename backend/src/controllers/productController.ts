import { Request, Response } from 'express';
import { createProductService, getProductsService, updateProductService, deleteProductService, getProductService, getProductionSuggestionService } from '../services/productService.js';
import { createProductSchema, updateProductSchema, getProductsQuerySchema } from '../validations/productValidation.js';

export async function createProduct(req: Request, res: Response) {
  const data = createProductSchema.parse(req.body);
  const product = await createProductService(data);
  return res.status(201).json(product);
}

export async function getProduct(req: Request, res: Response) {
  const product = await getProductService(req.params.id as string);
  return res.status(200).json(product);
}

export async function getProducts(req: Request, res: Response) {
  const parsedQuery = getProductsQuerySchema.parse(req.query);

  const query = {
    page: parsedQuery.page ? Number(parsedQuery.page) : 1,
    limit: parsedQuery.limit ? Number(parsedQuery.limit) : 10,
    order: parsedQuery.order ?? 'createdAt',
    sort: parsedQuery.sort ?? 'asc',
    code: parsedQuery.code ?? '',
    name: parsedQuery.name ?? ''
  };

  const products = await getProductsService(query);
  return res.status(200).json(products);
}

export async function updateProduct(req: Request, res: Response) {
  const data = updateProductSchema.parse(req.body);
  const product = await updateProductService(req.params.id as string, data);
  return res.status(200).json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  await deleteProductService(req.params.id as string);
  return res.status(200).json({ message: 'Produto deletado com sucesso' });
}

export async function getProductionSuggestion(req: Request, res: Response) {
  const result = await getProductionSuggestionService();
  return res.status(200).json({ data: result });
}