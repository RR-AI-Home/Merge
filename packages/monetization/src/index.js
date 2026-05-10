export function createCosmeticSku({ id, name, priceTier }) {
  return {
    id,
    name,
    priceTier,
    category: 'cosmetic',
    payToWin: false
  };
}
