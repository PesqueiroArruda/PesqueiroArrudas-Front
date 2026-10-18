import { Product } from 'types/Product';
import { IfoodOrderItem } from 'types/IfoodOrder';
import { IfoodProductMapping } from 'types/IfoodProductMapping';
import { getIfoodMappingKey } from './ifoodMappingKey';
import { normalizeName, stripIfoodToken } from './normalizeName';

// Resolve o produto do catálogo correspondente a um item de pedido do iFood:
// 1) vínculo já salvo (chave em ifoodMappingKey.ts); 2) nome batendo exato (sem acento/
// maiúscula, ignorando a palavra "ifood") com exatamente um produto do
// catálogo. Duas ou mais correspondências, ou nenhuma, fica null — melhor
// pedir pro atendente escolher do que arriscar vincular ao produto errado.
export function resolveIfoodItemProduct(
  item: IfoodOrderItem,
  products: Product[],
  mappings: IfoodProductMapping[]
): string | null {
  const mappingKey = getIfoodMappingKey(item);
  const mapping = mappingKey
    ? mappings.find((m) => m.externalCode === mappingKey)
    : undefined;
  if (mapping) {
    // Vínculo apontando pra produto que não existe mais: deixa sem produto pro
    // atendente escolher de novo, em vez de cair no nome e dar baixa errada.
    return products.some((product) => product._id === mapping.productId)
      ? mapping.productId
      : null;
  }

  const targetKey = stripIfoodToken(normalizeName(item.name));
  if (!targetKey) return null;

  const candidates = products.filter((product) => stripIfoodToken(normalizeName(product.name)) === targetKey);

  return candidates.length === 1 ? candidates[0]._id : null;
}
