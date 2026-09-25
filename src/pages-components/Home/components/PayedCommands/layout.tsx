/* eslint-disable react/destructuring-assignment */
import { Wallet, Loader2, ArrowRight, AlertTriangle, Pencil } from 'lucide-react';
import { DateTime } from 'luxon';

import { Button } from 'components/ui/button';
import { Payment } from 'pages-components/Home/types/Payment';
import { get10PastDays } from 'utils/get10PastDays';
import { formatPaymentTypes } from 'utils/formatPaymentTypes';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  payedCommandsDateISO: string;
  setPayedCommandsDateISO: (value: string) => void;
  payments: Payment[];
  pendingCommandsDates: string[];
  handleGoToCommandPage: (commandId: string) => void;
  handleCloseCashier: () => void;
  isGettingPayments: boolean;
  total: number;
  isAdmin: boolean;
  editingPaymentId: string | null;
  editingDate: string;
  setEditingDate: (value: string) => void;
  isSavingDate: boolean;
  handleStartEditDate: (payment: { _id: string; createdAt: string }) => void;
  handleCancelEditDate: () => void;
  handleSaveEditDate: () => void;
}

export const PayedCommandsLayout = ({
  payedCommandsDateISO,
  setPayedCommandsDateISO,
  payments,
  pendingCommandsDates,
  handleGoToCommandPage,
  handleCloseCashier,
  isGettingPayments,
  total,
  isAdmin,
  editingPaymentId,
  editingDate,
  setEditingDate,
  isSavingDate,
  handleStartEditDate,
  handleCancelEditDate,
  handleSaveEditDate,
}: Props) => {
  const past10Days = get10PastDays();
  return (
    <div className="flex flex-col gap-5">
      {pendingCommandsDates.length > 0 && (
        <div className="flex items-start gap-2 rounded-card border border-gold bg-gold/10 px-4 py-3 text-sm text-navy">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            Há comandas em aberto de <span className="font-bold">{pendingCommandsDates.join(', ')}</span>. Confira
            antes de fechar o caixa.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Comandas Pagas</h2>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={payedCommandsDateISO}
            onChange={(e) => setPayedCommandsDateISO(e.target.value)}
            className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {past10Days.map(({ formatted, date }) => (
              <option key={`10-days-${formatted}`} value={date.toISODate() as string}>
                {formatted}
              </option>
            ))}
            {!past10Days.some(({ date }) => date.toISODate() === payedCommandsDateISO) && (
              <option value={payedCommandsDateISO}>
                {DateTime.fromISO(payedCommandsDateISO, { zone: 'America/Sao_Paulo' })
                  .setLocale('pt-BR')
                  .toLocaleString(DateTime.DATE_FULL)}
              </option>
            )}
          </select>
          <input
            type="date"
            value={payedCommandsDateISO}
            onChange={(e) => e.target.value && setPayedCommandsDateISO(e.target.value)}
            title="Escolher outra data"
            className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
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
                  {editingPaymentId === _id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                        disabled={isSavingDate}
                        className="h-9 flex-1 rounded-(--radius) border border-input bg-card px-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={handleSaveEditDate}
                        disabled={isSavingDate}
                        className="rounded-(--radius) border-2 border-cyan px-2 py-1 text-xs font-bold text-cyan hover:bg-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditDate}
                        disabled={isSavingDate}
                        className="rounded-(--radius) border-2 border-border px-2 py-1 text-xs font-bold text-text-muted hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <p className="flex items-center gap-1.5">
                      Criada em:{' '}
                      <span className="font-bold text-navy">
                        {DateTime.fromISO(createdAt, { zone: 'pt-BR', setZone: true })
                          .setLocale('pt-BR')
                          .toLocaleString(DateTime.DATETIME_MED)}
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleStartEditDate({ _id, createdAt })}
                          title="Editar data do pagamento"
                          className="text-text-muted hover:text-cyan"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </p>
                  )}
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
