import { Command } from 'types/Command';

export const getCommandBalance = (command: Command): number | null => {
  const { total, totalPayed, discount = 0 } = command;
  if (
    typeof total !== 'number' ||
    typeof totalPayed !== 'number' ||
    ![total, totalPayed, discount].every(
      (value) => Number.isFinite(value) && value >= 0
    ) ||
    discount > total
  ) {
    return null;
  }

  const cents = [total, totalPayed, discount].map((value) =>
    Math.round(value * 100)
  );
  if (!cents.every(Number.isSafeInteger)) return null;
  return Math.max(cents[0] - cents[1] - cents[2], 0) / 100;
};
