import { DateTime } from 'luxon';
import { BadgeCheck, GripVertical, MoreVertical, Snowflake } from 'lucide-react';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { OrderProduct } from 'types/OrderProduct';
import { Order } from '../../../../types/Order';

const productColumns = [
  { text: 'Quantidade', prop: 'amount' },
  { text: 'Nome', prop: 'name' },
  { text: '', prop: '*' },
];

interface Props {
  order: Order;
  handleCheckOneProduct: (product: OrderProduct) => void;
  handleDefrostOneProduct: (product: OrderProduct) => void;
  handleOpenCheckOrderModal: (orderToCheck: Order) => void;
  listeners: any;
  isDragging: boolean;
}

export const OrderLayout = ({
  order,
  handleCheckOneProduct,
  handleDefrostOneProduct,
  handleOpenCheckOrderModal,
  listeners,
  isDragging,
}: Props) => {
  const dt = DateTime.fromISO(order?.createdAt as string, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');

  const createdAtFormatted = dt.toLocaleString(DateTime.TIME_24_SIMPLE);

  return (
    <div className="flex flex-col gap-2 rounded-card border border-border bg-secondary p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-base font-semibold text-navy sm:text-lg">
          Mesa: <span className="font-bold">{order?.table}</span>
        </span>
        <span className="text-base font-semibold text-navy sm:text-lg">
          Pedido por: <span className="font-bold">{order?.orderWaiter}</span>
        </span>
        <span className="text-sm text-navy">
          Criado: <span className="font-semibold">{createdAtFormatted}</span>
        </span>
        <button
          type="button"
          aria-label="Arrastar para reordenar"
          {...listeners}
          tabIndex={0}
          className={cn(
            'rounded-(--radius) p-1.5 text-navy hover:bg-border',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
        >
          <GripVertical className="h-5 w-5" />
        </button>
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
              <TableHead key={`kitchen-order-product-column-${column.prop}`}>{column.text}</TableHead>
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

                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-(--radius) p-1 text-navy hover:bg-card">
                      <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleCheckOneProduct({ _id, name, amount, isMade, isThawed })}>
                        <BadgeCheck className="h-4 w-4" />
                        Marcar item como feito
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDefrostOneProduct({ _id, name, amount, isMade, isThawed })}
                      >
                        <Snowflake className="h-4 w-4" />
                        Marcar item como descongelado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => handleOpenCheckOrderModal(order)}>Baixar pedido</Button>
    </div>
  );
};
