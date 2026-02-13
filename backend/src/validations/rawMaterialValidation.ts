import { z } from 'zod';

export const createRawMaterialSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  stockQuantity: z.number().int().min(0, 'Quantidade em estoque não pode ser negativa')
});

export const updateRawMaterialSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(2).optional(),
  stockQuantity: z.number().int().min(0).optional()
});

export const getRawMaterialsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  order: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  code: z.string().optional(),
  name: z.string().optional()
});