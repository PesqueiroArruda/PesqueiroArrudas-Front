import { AppShell } from 'components/AppShell';
import { OrdersList } from './components/OrdersList';
import { Order } from '../../types/Order';

interface Props {
  orders: Order[];
}

export const KitchenLayout = ({ orders }: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Cozinha</h1>
      <OrdersList orders={orders} />
    </div>
  </AppShell>
);
