import { Request, Response } from 'express';
import { createRawMaterialService, getRawMaterialsService, getRawMaterialService, updateRawMaterialService, deleteRawMaterialService } from '../services/rawMaterialService.js';
import { createRawMaterialSchema, updateRawMaterialSchema, getRawMaterialsQuerySchema } from '../validations/rawMaterialValidation.js';

export async function createRawMaterial(req: Request, res: Response) {
  const data = createRawMaterialSchema.parse(req.body);
  const material = await createRawMaterialService(data);
  return res.status(201).json(material);
}

export async function getRawMaterial(req: Request, res: Response) {
  const material = await getRawMaterialService(req.params.id as string);
  return res.status(200).json(material);
}

export async function getRawMaterials(req: Request, res: Response) {
  const parsedQuery = getRawMaterialsQuerySchema.parse(req.query);

  const query = {
    page: parsedQuery.page ? Number(parsedQuery.page) : 1,
    limit: parsedQuery.limit ? Number(parsedQuery.limit) : 10,
    order: parsedQuery.order ?? 'createdAt',
    sort: (parsedQuery.sort as 'asc' | 'desc') ?? 'asc',
    code: parsedQuery.code ?? '',
    name: parsedQuery.name ?? ''
  };

  const result = await getRawMaterialsService(query);
  return res.status(200).json(result);
}

export async function updateRawMaterial(req: Request, res: Response) {
  const data = updateRawMaterialSchema.parse(req.body);
  const material = await updateRawMaterialService(req.params.id as string, data);
  return res.status(200).json(material);
}

export async function deleteRawMaterial(req: Request, res: Response) {
  await deleteRawMaterialService(req.params.id as string);
  return res.status(200).json({ message: 'Matéria-prima deletada com sucesso' });
}