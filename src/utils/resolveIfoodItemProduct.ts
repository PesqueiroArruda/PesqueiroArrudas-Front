import { Product } from 'types/Product';
import { IfoodOrderItem } from 'types/IfoodOrder';
import { IfoodProductMapping } from 'types/IfoodProductMapping';
import { normalizeName, stripIfoodToken } from './normalizeName';

// Resolve o produto do catálogo correspondente a um item de pedido do iFood:
// 1) vínculo já salvo pelo externalCode; 2) nome batendo exato (sem acento/
// maiúscula, ignorando a palavra "ifood") com exatamente um produto do
// catálogo. Duas ou mais correspondências, ou nenhuma, fica null — melhor
// pedir pro atendente escolher do que arriscar vincular ao produto errado.
export function resolveIfoodItemProduct(
  item: IfoodOrderItem,
  products: Product[],
  mappings: IfoodProductMapping[]
): string | null {
  const mapping = mappings.find((m) => m.externalCode === item.externalCode);
  if (mapping) return mapping.productId;

  const targetKey = stripIfoodToken(normalizeName(item.name));
  if (!targetKey) return null;

  const candidates = products.filter((product) => stripIfoodToken(normalizeName(product.name)) === targetKey);

  return candidates.length === 1 ? candidates[0]._id : null;
}
