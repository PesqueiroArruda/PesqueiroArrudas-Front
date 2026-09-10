interface PaymentInput {
  receivedValue: string;
  totalDue: number;
  isCash: boolean;
}

export const calculatePayment = ({
  receivedValue,
  totalDue,
  isCash,
}: PaymentInput) => {
  const normalized = receivedValue.trim().replace(',', '.');
  const received = Number(normalized);
  const receivedCents = Math.round(received * 100);
  const dueCents = Math.round(totalDue * 100);
  const isValid =
    /^\d+(?:\.\d{1,2})?$/.test(normalized) &&
    Number.isSafeInteger(receivedCents) &&
    Number.isSafeInteger(dueCents) &&
    receivedCents > 0 &&
    dueCents > 0 &&
    (isCash || receivedCents <= dueCents);

  return {
    isValid,
    amount: isValid ? Math.min(receivedCents, dueCents) / 100 : 0,
    change: isValid && isCash ? Math.max(receivedCents - dueCents, 0) / 100 : 0,
  };
};
