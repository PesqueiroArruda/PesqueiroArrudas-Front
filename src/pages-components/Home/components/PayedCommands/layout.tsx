/* eslint-disable react/destructuring-assignment */
import { Wallet, Loader2, ArrowRight } from 'lucide-react';
import { DateTime } from 'luxon';

import { Button } from 'components/ui/button';
import { Payment } from 'pages-components/Home/types/Payment';
import { get10PastDays } from 'utils/get10PastDays';
import { formatPaymentTypes } from 'utils/formatPaymentTypes';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  payedCommandsDate: any;
  setPayedCommandsDate: any;
  payments: Payment[];
  handleGoToCommandPage: (commandId: string) => void;
  handleCloseCashier: () => void;
  isGettingPayments: boolean;
  total: number;
  isAdmin: boolean;
}

export const PayedCommandsLayout = ({
  payedCommandsDate,
  setPayedCommandsDate,
  payments,
  handleGoToCommandPage,
  handleCloseCashier,
  isGettingPayments,
  total,
  isAdmin,
}: Props) => {
  const past10Days = get10PastDays();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Comandas Pagas</h2>

        <div className="flex items-center gap-3">
          <select
            value={payedCommandsDate}
            onChange={(e) => setPayedCommandsDate(e.target.value)}
            className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {past10Days.map(({ formatted }) => (
              <option key={`10-days-${formatted}`}>{formatted}</option>
            ))}
          </select>
          <Button onClick={handleCloseCashier} disabled={!isAdmin}>
            Fechar Caixa
            <Wallet className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-lg font-bold text-navy">Total: {parseToBRL(total || 0)}</p>

      {isGettingPayments ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {payments?.map(
            ({ _id, totalPayed, paymentTypes, createdAt, command, waiterExtra, observation }) => {
              const products = command?.products || [];
              const visibleProducts = products.length > 3 ? products.slice(0, 3) : products;

              return (
                <div
                  key={`home-payments-${_id}`}
                  className="flex flex-col gap-1.5 rounded-card border border-border bg-card p-4 text-sm text-foreground shadow-card"
                >
                  <p>
                    Mesa: <span className="font-bold text-navy">{command?.table}</span>
                  </p>
                  <p>
                    Total: <span className="font-bold text-navy">{parseToBRL(totalPayed || 0)}</span>
                  </p>
                  <p>
                    Meio de Pagamento:{' '}
                    <span className="font-bold text-navy">
                      {formatPaymentTypes(paymentTypes) || paymentTypes[0]}
                    </span>
                  </p>
                  <p>
                    Criada em:{' '}
                    <span className="font-bold text-navy">
                      {DateTime.fromISO(createdAt, { zone: 'pt-BR', setZone: true })
                        .setLocale('pt-BR')
                        .toLocaleString(DateTime.DATETIME_MED)}
                    </span>
                  </p>
                  <p>
                    Caixinha {command?.waiter}:{' '}
                    <span className="font-bold text-navy">{parseToBRL(waiterExtra || 0)}</span>
                  </p>
                  {observation && <p className="text-xs text-text-muted">Obs: {observation}</p>}

                  <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3 text-sm font-semibold text-text-muted">
                    {visibleProducts.map(({ _id: productId, name, amount }) => (
                      <span key={`pay-${_id}-${productId}`}>
                        {name} - {amount}
                      </span>
                    ))}
                    {products.length > 3 && <span className="font-bold">...</span>}
                    <button
                      type="button"
                      onClick={() => handleGoToCommandPage(command?._id as string)}
                      className="mt-1 flex items-center gap-1.5 self-end rounded-(--radius) border-2 border-cyan px-3 py-1.5 text-sm font-bold text-cyan transition-colors hover:bg-cyan hover:text-white"
                    >
                      Ver comanda
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            },
          )}
          {payments.length === 0 && (
            <div className="rounded-card border border-border bg-card px-4 py-3">
              <p className="text-lg font-bold text-navy">Nenhuma comanda paga. :(</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
