interface ProductLike {
  _id?: string;
  name: string;
}

const DIACRITICS_REGEX = /[̀-ͯ]/g;
const NON_LETTER_REGEX = /[^\p{L}\s]/gu;
const WHITESPACE_REGEX = /\s+/g;
const NUMBER_REGEX = /\d+([.,]\d+)?/g;

function normalize(name: string) {
  return name.normalize('NFD').replace(DIACRITICS_REGEX, '').toLowerCase().trim();
}

// Números (350ml, 2L, etc.) são o sinal mais forte de que dois nomes são
// tamanhos/variações diferentes do mesmo produto, não o mesmo item escrito
// diferente — por isso viram uma assinatura à parte, comparada por igualdade
// exata, em vez de entrar na comparação de similaridade textual.
function extractSignature(name: string) {
  const normalized = normalize(name);
  const numbers = (normalized.match(NUMBER_REGEX) || []).map((n) => n.replace(',', '.'));
  const alphaOnly = normalized.replace(NON_LETTER_REGEX, ' ').replace(WHITESPACE_REGEX, ' ').trim();
  return { alphaOnly, numbers };
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i += 1) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j += 1) {
      const insertCost = currentRow[j] + 1;
      const deleteCost = previousRow[j + 1] + 1;
      const substituteCost = previousRow[j] + (a[i] === b[j] ? 0 : 1);
      currentRow.push(Math.min(insertCost, deleteCost, substituteCost));
    }
    previousRow = currentRow;
  }

  return previousRow[b.length];
}

function similarityRatio(a: string, b: string) {
  if (a.length === 0 && b.length === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

type Signature = ReturnType<typeof extractSignature>;

function isSimilar(a: Signature, b: Signature, threshold: number) {
  const sameNumbers =
    a.numbers.length === b.numbers.length && a.numbers.every((n, idx) => n === b.numbers[idx]);
  if (!sameNumbers) return false;

  const isExactMatch = a.alphaOnly === b.alphaOnly;
  return isExactMatch || similarityRatio(a.alphaOnly, b.alphaOnly) >= threshold;
}

// Agrupa produtos cujo nome é essencialmente o mesmo (typo, acento,
// maiúsculo/minúsculo, espaçamento) — nunca agrupa nomes com números
// diferentes (tamanhos/variações diferentes ficam sempre separados).
// Só retorna grupos com 2+ produtos (o resto não tem duplicata candidata).
export function findSimilarProductGroups<T extends ProductLike>(
  products: T[],
  threshold = 0.82
): T[][] {
  const signatures = products.map((product) => ({ product, ...extractSignature(product.name) }));
  const used = new Set<number>();
  const groups: T[][] = [];

  for (let i = 0; i < signatures.length; i += 1) {
    if (!used.has(i)) {
      const group: T[] = [signatures[i].product];

      for (let j = i + 1; j < signatures.length; j += 1) {
        if (!used.has(j) && isSimilar(signatures[i], signatures[j], threshold)) {
          group.push(signatures[j].product);
          used.add(j);
        }
      }

      if (group.length > 1) {
        used.add(i);
        groups.push(group);
      }
    }
  }

  return groups;
}
