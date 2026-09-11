const DIACRITICS_REGEX = /[̀-ͯ]/g;

export function normalizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim();
}

const STRAY_PUNCTUATION_REGEX = /^[^\p{L}]+|[^\p{L}]+$/gu;

export function stripStrayPunctuation(name: string) {
  return name.replace(STRAY_PUNCTUATION_REGEX, '');
}

// Remove a palavra "ifood" como token isolado (não afeta palavras que só
// contêm "ifood" como parte de outra palavra) — usado pra casar nomes de
// itens do cardápio do iFood com os produtos do catálogo que têm "IFOOD"
// no nome só pra marcar o preço com taxa embutida.
export function stripIfoodToken(normalizedName: string) {
  return normalizedName
    .split(/\s+/)
    .filter((word) => word !== 'ifood')
    .join(' ')
    .trim();
}
