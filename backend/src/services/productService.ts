import { Prisma, RawMaterial } from '@prisma/client';
import { AppError } from '../errors/AppError.js';
import { isValidUUID } from '../utils/isValidUUID.js';
import { prisma } from '../database/prisma.js';


interface GetProductsQuery {
  page?: number;
  limit?: number;
  order?: string;
  sort?: 'asc' | 'desc';
  code?: string | undefined;
  name?: string | undefined;
}

export async function createProductService(data: {
  code: string;
  name: string;
  price: number;
  materials?: { rawMaterialId: string; requiredAmount: number }[];
}) {
  return prisma.product.create({
    data: {
      code: data.code,
      name: data.name,
      price: data.price,
      materials: {
        create: data.materials?.map(m => ({
          rawMaterialId: m.rawMaterialId,
          requiredAmount: m.requiredAmount
        }))
      }
    },
    include: {
      materials: {
        include: {
          rawMaterial: true
        }
      }
    }
  });
}

export async function getProductService(id: string) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, code: true, name: true, price: true }
  });

  if (!product) throw new AppError('Produto não encontrado', 404);

  return product;
}

export async function getProductsService(query: GetProductsQuery) {
  const { page = 1, limit = 10, order = 'createdAt', sort = 'asc', code, name } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (code) where.code = { contains: code, mode: 'insensitive' };
  if (name) where.name = { contains: name, mode: 'insensitive' };

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [order]: sort },
    select: { id: true, code: true, name: true, price: true }
  });

  const total = await prisma.product.count({ where });

  return {
    data: products,
    meta: { page, limit, total }
  };
}

export async function updateProductService(id: string, data: { 
  code?: string; 
  name?: string; 
  price?: number; 
  materials?: { rawMaterialId: string; requiredAmount: number }[] 
}) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw new AppError('Produto não encontrado', 404);

  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        price: data.price,
      },
    });

    if (data.materials) {
      await tx.productRawMaterial.deleteMany({
        where: { productId: id }
      });

      await tx.productRawMaterial.createMany({
        data: data.materials.map(m => ({
          productId: id,
          rawMaterialId: m.rawMaterialId,
          requiredAmount: Number(m.requiredAmount)
        }))
      });
    }

    return tx.product.findUnique({
      where: { id },
      include: { 
        materials: { include: { rawMaterial: true } } 
      }
    });
  });
}

export async function deleteProductService(id: string) {
  if (!isValidUUID(id)) throw new AppError('ID inválido', 400);

  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw new AppError('Produto não encontrado', 404);

  await prisma.product.delete({ where: { id } });
}

export async function getProductionSuggestionService() {
  const products = await prisma.product.findMany({
    include: {
      materials: {
        include: { rawMaterial: true }
      }
    },
    orderBy: { price: 'desc' }
  });

  const rawMaterials = await prisma.rawMaterial.findMany();
  
  const inventory = new Map<string, number>(
    rawMaterials.map((m: any) => [m.id, m.stockQuantity])
  );

  const suggestion = [];
  let totalValue = 0;

  for (const product of products) {
    if (!product.materials || product.materials.length === 0) {
      continue; 
    }

    let producedCount = 0;
    let canProduce = true;
    const productPrice = Number(product.price);

    while (canProduce) {
      for (const item of product.materials) {
        const currentStock = inventory.get(item.rawMaterialId) || 0;
        
        if (item.requiredAmount <= 0) {
          canProduce = false;
          break;
        }

        if (currentStock < item.requiredAmount) {
          canProduce = false;
          break;
        }
      }

      if (canProduce) {
        for (const item of product.materials) {
          const currentStock = inventory.get(item.rawMaterialId) || 0;
          inventory.set(item.rawMaterialId, currentStock - item.requiredAmount);
        }
        producedCount++;
      }
    }

    if (producedCount > 0) {
      const subtotal = producedCount * productPrice;
      
      suggestion.push({
        id: product.id,
        name: product.name,
        price: productPrice,
        quantity: producedCount,
        subtotal: subtotal,
        materials: product.materials.map(m => ({
          name: m.rawMaterial.name,
          requiredAmount: m.requiredAmount
        }))
      });
      
      totalValue += subtotal;
    }
  }

  return {
    suggestion,
    totalValue
  };
}