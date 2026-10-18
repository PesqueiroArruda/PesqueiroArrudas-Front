export type StockOperation = 'diminish' | 'increase';

// Dado o que o servidor tem hoje e a quantidade que o atendente deixou depois
// de clicar em + e - várias vezes, diz se precisa chamar a API e quanto mexer
// no estoque. Aumentar a quantidade na comanda tira do estoque (diminish) e
// diminuir devolve (increase). Sem diferença, não chama nada.
export function planAmountChange(
  serverAmount: number,
  targetAmount: number
): { delta: number; operation: StockOperation | null } {
  const delta = targetAmount - serverAmount;
  if (delta === 0) return { delta: 0, operation: null };
  return {
    delta: Math.abs(delta),
    operation: delta > 0 ? 'diminish' : 'increase',
  };
}
