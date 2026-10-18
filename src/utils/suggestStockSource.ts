// Sugere de qual produto um item do iFood deve usar o estoque. O padrão do
// pesqueiro é o mesmo nome com "IFOOD" a mais ("Marmitex de Tilápia IFOOD" e
// "Marmitex de Tilápia"). Só sugere: quem confirma o vínculo é o usuário.
// Fica sem imports de propósito, pra o teste conseguir carregar o arquivo.

interface ProductLike {
  _id?: string;
  name: string;
  stockSourceId?: string | null;
}

export interface StockSourceSuggestion {
  sourceId: string;
  // exact: nome igual depois de tirar "IFOOD". similar: parecido ou ambíguo,
  // vale conferir antes de confirmar.
  confidence: 'exact' | 'similar';
}

const DIACRITICS_REGEX = /[̀-ͯ]/g;
const SIMILARITY_THRESHOLD = 0.85;

function normalizeWords(name: string) {
  return name
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

export function hasIfoodToken(name: string) {
  return normalizeWords(name).includes('ifood');
}

function withoutIfood(name: string) {
  return normalizeWords(name)
    .filter((word) => word !== 'ifood')
    .join(' ');
}

function numbersOf(text: string) {
  return (text.match(/\d+/g) || []).join(',');
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i += 1) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j += 1) {
      currentRow.push(
        Math.min(
          currentRow[j] + 1,
          previousRow[j + 1] + 1,
          previousRow[j] + (a[i] === b[j] ? 0 : 1)
        )
      );
    }
    previousRow = currentRow;
  }
  return previousRow[b.length];
}

function similarity(a: string, b: string) {
  const longest = Math.max(a.length, b.length);
  return longest === 0 ? 1 : 1 - levenshtein(a, b) / longest;
}

export function suggestStockSource(
  product: ProductLike,
  products: ProductLike[]
): StockSourceSuggestion | null {
  const target = withoutIfood(product.name);
  if (!target) return null;

  // Origem possível: produto do salão (sem "IFOOD"), que não usa o estoque de
  // outro e não é o próprio item.
  const candidates = products.filter(
    (candidate) =>
      candidate._id &&
      candidate._id !== product._id &&
      !candidate.stockSourceId &&
      !hasIfoodToken(candidate.name)
  );

  const exact = candidates.filter((candidate) => withoutIfood(candidate.name) === target);
  if (exact.length === 1) {
    return { sourceId: exact[0]._id as string, confidence: 'exact' };
  }
  if (exact.length > 1) {
    return { sourceId: exact[0]._id as string, confidence: 'similar' };
  }

  // Números diferentes ("2 pessoas" e "3 pessoas") são variações, não o mesmo item.
  let best: { id: string; score: number } | null = null;
  candidates.forEach((candidate) => {
    const candidateName = withoutIfood(candidate.name);
    if (numbersOf(candidateName) !== numbersOf(target)) return;
    const score = similarity(candidateName, target);
    if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = { id: candidate._id as string, score };
    }
  });

  return best ? { sourceId: (best as { id: string }).id, confidence: 'similar' } : null;
}

// Produtos "IFOOD" que ainda não usam o estoque de ninguém, cada um com a
// sugestão (ou null quando não há candidato parecido o bastante).
export function listIfoodSuggestions<T extends ProductLike>(products: T[]) {
  return products
    .filter((product) => hasIfoodToken(product.name) && !product.stockSourceId)
    .map((product) => ({ product, suggestion: suggestStockSource(product, products) }));
}
