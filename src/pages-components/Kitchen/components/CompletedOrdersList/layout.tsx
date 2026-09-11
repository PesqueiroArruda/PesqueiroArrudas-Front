import { DateTime } from 'luxon';
import { BadgeCheck, Inbox, Loader2, Snowflake } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { Order } from '../../../../types/Order';

interface Props {
  orders: Order[];
  isLoading: boolean;
}

const productColumns = [
  { text: 'Quantidade', prop: 'amount' },
  { text: 'Nome', prop: 'name' },
  { text: '', prop: '*' },
];

export const CompletedOrdersListLayout = ({ orders, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const kitchenOrders = orders.filter((o) => o.orderCategory === 'kitchen');

  if (kitchenOrders.length === 0) {
    return (
      <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
        <Inbox className="h-6 w-6 text-navy" />
        <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
          Nenhum pedido concluído encontrado
        </span>
      </div>
    );
  }

  const sortedOrders = [...kitchenOrders].sort((a, b) => {
    const dateA = a.createdAt ? DateTime.fromISO(a.createdAt).toMillis() : 0;
    const dateB = b.createdAt ? DateTime.fromISO(b.createdAt).toMillis() : 0;
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col gap-3">
      {sortedOrders.map((order) => {
        const createdAtFormatted = order.createdAt
          ? DateTime.fromISO(order.createdAt, { zone: 'pt-BR', setZone: true })
              .setLocale('pt-BR')
              .toLocaleString(DateTime.DATETIME_MED)
          : '';

        const isFromIfood = order.table?.startsWith('iFood #');

        return (
          <div
            key={order._id}
            className={cn(
              'flex flex-col gap-2 rounded-card border p-3 sm:p-4',
              isFromIfood ? 'border-destructive/40 bg-destructive/10' : 'border-border bg-secondary',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-base font-semibold text-navy sm:text-lg">
                Mesa: <span className="font-bold">{order.table}</span>
              </span>
              <span className="text-base font-semibold text-navy sm:text-lg">
                Pedido por: <span className="font-bold">{order.orderWaiter}</span>
              </span>
              <span className="text-sm text-navy">
                Criado: <span className="font-semibold">{createdAtFormatted}</span>
              </span>
            </div>

            {order.observation && (
              <div className="rounded-(--radius) bg-destructive px-2.5 py-1.5 text-sm font-semibold text-white">
                {order.observation}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  {productColumns.map((column) => (
                    <TableHead key={`completed-order-product-column-${column.prop}`}>{column.text}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map(({ _id, name, amount, isMade, isThawed }) => (
                  <TableRow key={`${order._id}${_id}`}>
                    <TableCell>{amount}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {isMade && (
                          <span className="flex items-center gap-1.5 rounded-(--radius) bg-success px-2 py-1 text-sm font-bold text-white">
                            <BadgeCheck className="h-4 w-4" />
                            Feito
                          </span>
                        )}
                        {isThawed && (
                          <span className="flex items-center gap-1.5 rounded-(--radius) bg-cyan px-2 py-1 text-sm font-bold text-white">
                            <Snowflake className="h-4 w-4" />
                            Descongelado
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};
