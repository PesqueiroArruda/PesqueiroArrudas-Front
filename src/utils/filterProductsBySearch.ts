const DIACRITICS_REGEX = /[̀-ͯ]/g;

interface Searchable {
  name: string;
  category?: string;
}

// Mesma regra de busca do estoque (utils/normalizeSearch): sem acento, sem
// maiúsculas e sem espaços, então "pao dealho" acha "Pão de Alho". Fica aqui
// dentro de propósito pra o teste conseguir carregar o arquivo sozinho.
function normalize(text: unknown) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

// Acha pelo nome ou pela categoria, como o estoque. Quem começa com o texto
// digitado vem primeiro; o resto fica em ordem alfabética.
export function filterProductsBySearch<T extends Searchable>(
  products: T[],
  search: string
): T[] {
  const normalizedSearch = normalize(search);
  if (!normalizedSearch) return products;

  return products
    .map((product) => {
      const normalizedName = normalize(product.name);
      const matches =
        normalizedName.includes(normalizedSearch) ||
        normalize(product.category).includes(normalizedSearch);
      if (!matches) return null;
      return { product, rank: normalizedName.startsWith(normalizedSearch) ? 0 : 1 };
    })
    .filter((entry): entry is { product: T; rank: number } => entry !== null)
    .sort(
      (a, b) =>
        a.rank - b.rank || a.product.name.localeCompare(b.product.name, 'pt-BR')
    )
    .map((entry) => entry.product);
}
