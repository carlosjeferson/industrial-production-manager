import { vi, describe, it, expect } from 'vitest';
import { getProductionSuggestionService } from './productService.js';
import { prisma } from '../database/prisma.js';

vi.mock('../database/prisma.js', () => ({
  prisma: {
    product: { findMany: vi.fn() },
    rawMaterial: { findMany: vi.fn() }
  }
}));

describe('Production Intelligence Logic', () => {
  it('should prioritize higher value products first', async () => {

    const findManyMaterialsMock = vi.mocked(prisma.rawMaterial.findMany);
    const findManyProductsMock = vi.mocked(prisma.product.findMany);

    findManyMaterialsMock.mockResolvedValue([
      { id: 'wood-id', code: 'WD-001', name: 'Wood', stockQuantity: 5, createdAt: new Date(), updatedAt: new Date() }
    ]);

    findManyProductsMock.mockResolvedValue([
      {
        id: 'table-id',
        name: 'Luxury Table',
        price: 500,
        materials: [{ rawMaterialId: 'wood-id', requiredAmount: 5 }]
      },
      {
        id: 'chair-id',
        name: 'Simple Chair',
        price: 100,
        materials: [{ rawMaterialId: 'wood-id', requiredAmount: 2 }]
      }
    ] as any);

    const result = await getProductionSuggestionService();

    expect(result.suggestion.length).toBeGreaterThan(0);
    expect(result.suggestion[0]!.name).toBe('Luxury Table');
    expect(result.totalValue).toBe(500);
  });
});