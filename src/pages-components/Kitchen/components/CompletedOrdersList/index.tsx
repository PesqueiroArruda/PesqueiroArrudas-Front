import { CompletedOrdersListLayout } from './layout';
import { Order } from '../../../../types/Order';

interface Props {
  orders: Order[];
  isLoading: boolean;
}

export const CompletedOrdersList = ({ orders, isLoading }: Props) => (
  <CompletedOrdersListLayout orders={orders} isLoading={isLoading} />
);
