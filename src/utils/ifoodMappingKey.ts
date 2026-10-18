import { IfoodOrderItem } from 'types/IfoodOrder';

// Chave do vínculo item do iFood -> produto do estoque. Usa o externalCode
// (código do restaurante no catálogo) e, quando o item vem sem ele, o id do
// item no catálogo do iFood. Precisa ser a mesma regra de getMappingKey no
// IfoodController.js do backend, que é quem grava o vínculo.
export function getIfoodMappingKey(
  item: Pick<IfoodOrderItem, 'id' | 'externalCode'>
): string {
  // Sem trim no valor devolvido: vínculos antigos foram gravados como veio.
  const { externalCode } = item;
  if (externalCode && externalCode.trim()) return externalCode;
  return item.id ? `ifood-item:${item.id}` : '';
}
