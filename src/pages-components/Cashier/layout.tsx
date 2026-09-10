import { Loader2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction } from 'react';

import { AppShell } from 'components/AppShell';
import { Input } from 'components/ui/input';
// eslint-disable-next-line import/named
import { Cashier, CashierPayment } from 'types/Cashier';
import { formatPaymentTypes } from 'utils/formatPaymentTypes';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  cashier: Cashier;
  handleBackPage: () => void;
  isLoading: boolean;
  payments: CashierPayment[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const CashierLayout = ({
  cashier,
  handleBackPage,
  isLoading,
  payments,
  search,
  setSearch,
}: Props) => {
  const dt = DateTime.fromISO(cashier?.date, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');

  return (
    <AppShell hasBackPageBtn handleBackPage={handleBackPage}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
              Caixa do dia: <span className="text-gold-strong">{dt.toLocaleString(DateTime.DATE_FULL)}</span>
            </h1>
            <div className="rounded-card bg-primary px-4 py-1.5">
              <span className="text-lg font-bold text-primary-foreground">
                Total: {parseToBRL(cashier?.total || 0)}
              </span>
            </div>
          </div>

          <Input
            placeholder="Pesquise por um pagamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-4">
            {payments?.map(({ _id, totalPayed, paymentTypes, command, waiterExtra }) => (
              <div
                key={`home-payments-${_id}`}
                className="flex flex-col gap-3 rounded-card border border-border bg-secondary p-3 text-navy sm:p-4"
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-(--radius) border border-border bg-card px-3 py-2 text-center text-sm font-semibold text-navy">
                    Mesa: <span className="font-bold text-gold-strong">{command?.table}</span>
                  </div>
                  <div className="rounded-(--radius) border border-border bg-card px-3 py-2 text-center text-sm font-semibold text-navy">
                    Total: <span className="font-bold text-gold-strong">{parseToBRL(totalPayed || 0)}</span>
                  </div>
                  <div className="rounded-(--radius) border border-border bg-card px-3 py-2 text-center text-sm font-semibold text-navy">
                    Caixinha {command?.waiter}:{' '}
                    <span className="font-bold text-gold-strong">{parseToBRL(waiterExtra || 0)}</span>
                  </div>
                  <div className="rounded-(--radius) border border-border bg-card px-3 py-2 text-center text-sm font-semibold text-navy">
                    Meio de Pagamento:{' '}
                    <span className="font-bold text-gold-strong">{formatPaymentTypes(paymentTypes)}</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {command?.products?.map(({ _id: productId, name, amount }) => (
                    <div
                      key={`cashier-pay-${_id}-${productId}`}
                      className="rounded-(--radius) bg-card px-2 py-2 text-center text-sm font-semibold text-navy shadow-sm"
                    >
                      {name} - {amount}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {payments?.length === 0 && (
              <div className="rounded-card border border-border bg-card px-4 py-3">
                <p className="text-lg font-bold text-navy">Nenhum pagamento encontrado.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
};
