import { WaiterProduct } from '../services/WaiterService';

// Produtos sem controle de estoque (o backend segue a mesma regra).
export function isSpecialProduct(name: string) {
  const formatted = name.toLowerCase().replace(/[^a-z]/gi, '');
  return ['pesquepague', 'pescapague', 'pescaesportiva', 'pesqueesportiva'].includes(formatted);
}

export function availableStock(product: WaiterProduct): number | null {
  if (isSpecialProduct(product.name)) return null;
  return typeof product.amount === 'number' ? product.amount : null;
}
