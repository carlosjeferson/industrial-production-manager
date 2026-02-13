import { z } from 'zod';

export const createProductSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  materials: z.array(z.object({
    rawMaterialId: z.string().uuid('ID de matéria-prima inválido'),
    requiredAmount: z.number().int().positive('Quantidade deve ser maior que zero')
  })).optional()
});

export const updateProductSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(2).optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
  materials: z.array(
    z.object({
      rawMaterialId: z.string().uuid(),
      requiredAmount: z.number().min(1)
    })
  ).optional()
});

export const getProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  order: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  code: z.string().optional(),
  name: z.string().optional()
});
