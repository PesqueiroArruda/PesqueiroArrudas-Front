import { Dispatch, SetStateAction } from 'react';

import { AppShell } from 'components/AppShell';
import { CompletedOrdersList } from './components/CompletedOrdersList';
import { OrdersList } from './components/OrdersList';
import { Order } from '../../types/Order';

interface Props {
  orders: Order[];
  orderStatusFilter: 'Pendentes' | 'Concluídos';
  setOrderStatusFilter: Dispatch<SetStateAction<'Pendentes' | 'Concluídos'>>;
  completedOrders: Order[];
  isLoadingCompleted: boolean;
}

export const KitchenLayout = ({
  orders,
  orderStatusFilter,
  setOrderStatusFilter,
  completedOrders,
  isLoadingCompleted,
}: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Cozinha</h1>
        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value as 'Pendentes' | 'Concluídos')}
          className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option>Pendentes</option>
          <option>Concluídos</option>
        </select>
      </div>

      {orderStatusFilter === 'Pendentes' ? (
        <OrdersList orders={orders} />
      ) : (
        <CompletedOrdersList orders={completedOrders} isLoading={isLoadingCompleted} />
      )}
    </div>
  </AppShell>
);
