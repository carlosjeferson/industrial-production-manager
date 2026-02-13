import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError.js';
import { isValidUUID } from '../utils/isValidUUID.js';
import { prisma } from '../database/prisma.js';

interface GetRawMaterialsQuery {
  page?: number;
  limit?: number;
  order?: string;
  sort?: 'asc' | 'desc';
  code?: string;
  name?: string;
}

export async function createRawMaterialService(data: Prisma.RawMaterialCreateInput) {
  const exists = await prisma.rawMaterial.findUnique({ where: { code: data.code } });
  if (exists) throw new AppError('Código de matéria-prima já cadastrado', 400);

  return prisma.rawMaterial.create({
    data,
    select: { id: true, code: true, name: true, stockQuantity: true }
  });
}

export async function getRawMaterialService(id: string) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const material = await prisma.rawMaterial.findUnique({
    where: { id },
    select: { id: true, code: true, name: true, stockQuantity: true }
  });

  if (!material) throw new AppError('Matéria-prima não encontrada', 404);

  return material;
}

export async function getRawMaterialsService(query: GetRawMaterialsQuery) {
  const { page = 1, limit = 10, order = 'createdAt', sort = 'asc', code, name } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.RawMaterialWhereInput = {};
  if (code) where.code = { contains: code, mode: 'insensitive' };
  if (name) where.name = { contains: name, mode: 'insensitive' };

  const materials = await prisma.rawMaterial.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [order]: sort },
    select: { id: true, code: true, name: true, stockQuantity: true }
  });

  const total = await prisma.rawMaterial.count({ where });

  return {
    data: materials,
    meta: { page, limit, total }
  };
}

export async function updateRawMaterialService(id: string, data: { code?: string; name?: string; stockQuantity?: number }) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const exists = await prisma.rawMaterial.findUnique({ where: { id } });
  if (!exists) throw new AppError('Matéria-prima não encontrada', 404);

  return prisma.rawMaterial.update({
    where: { id },
    data,
    select: { id: true, code: true, name: true, stockQuantity: true }
  });
}

export async function deleteRawMaterialService(id: string) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const exists = await prisma.rawMaterial.findUnique({ where: { id } });
  if (!exists) throw new AppError('Matéria-prima não encontrada', 404);

  await prisma.rawMaterial.delete({ where: { id } });
}