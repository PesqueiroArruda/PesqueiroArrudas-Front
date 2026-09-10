import { DateTime } from 'luxon';
import { Check, Inbox, Loader2, ShoppingBag, X } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { IfoodOrder } from 'types/IfoodOrder';

interface Props {
  ifoodOrders: IfoodOrder[];
  isLoading: boolean;
  processingId: string | null;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
}

export const IfoodOrdersLayout = ({
  ifoodOrders,
  isLoading,
  processingId,
  handleAccept,
  handleReject,
}: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-navy" />
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
          Pedidos iFood
        </h1>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {!isLoading && ifoodOrders.length === 0 && (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
          <Inbox className="h-6 w-6 text-navy" />
          <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
            Nenhum pedido do iFood pendente
          </span>
        </div>
      )}

      {!isLoading && ifoodOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          {ifoodOrders.map((order) => {
            const createdAtFormatted = order.createdAt
              ? DateTime.fromISO(order.createdAt, { zone: 'pt-BR', setZone: true })
                  .setLocale('pt-BR')
                  .toLocaleString(DateTime.DATETIME_MED)
              : '';
            const isProcessing = processingId === order._id;

            return (
              <div
                key={order._id}
                className="flex flex-col gap-3 rounded-card border border-border bg-secondary p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-semibold text-navy sm:text-lg">
                    Pedido iFood: <span className="font-bold">{order.ifoodOrderId}</span>
                  </span>
                  <span className="text-sm text-navy">
                    Recebido: <span className="font-semibold">{createdAtFormatted}</span>
                  </span>
                </div>

                <pre className="max-h-60 overflow-auto rounded-(--radius) border border-border bg-card p-3 text-xs text-foreground">
                  {JSON.stringify(order.rawPayload, null, 2)}
                </pre>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    variant="destructive"
                    disabled={isProcessing}
                    onClick={() => handleReject(order._id)}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Recusar
                  </Button>
                  <Button disabled={isProcessing} onClick={() => handleAccept(order._id)}>
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Aceitar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </AppShell>
);
