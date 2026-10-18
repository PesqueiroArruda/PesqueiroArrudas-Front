export const COMMAND_LOCATIONS = ['Salão', 'Deck', 'Lago'];

const LOCATION_SUFFIX_REGEX = new RegExp(
  `\\s*\\((${COMMAND_LOCATIONS.join('|')})\\)\\s*$`
);

// O local da comanda fica gravado no fim do nome da mesa: "Mesa 5 (Deck)".
export function parseCommandLocation(table?: string) {
  const text = table || '';
  const match = text.match(LOCATION_SUFFIX_REGEX);

  if (!match) {
    return { name: text, location: '' };
  }

  return { name: text.slice(0, match.index).trim(), location: match[1] };
}

export function buildTableName(name: string, location: string) {
  const trimmedName = name.trim();
  return location ? `${trimmedName} (${location})` : trimmedName;
}
