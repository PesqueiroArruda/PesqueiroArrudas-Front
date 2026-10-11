const DIACRITICS_REGEX = /[̀-ͯ]/g;

// Deixa o texto pronto pra comparar em buscas: sem acento, sem maiúsculas e
// sem nenhum espaço, então "pão de alho", "pao dealho" e "PAODEALHO" casam.
export function normalizeSearch(text: unknown) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}
