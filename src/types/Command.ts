import { IfoodDeliveryStatus } from './IfoodOrder';
import { Product } from './Product';

export interface Command {
  _id?: string;
  table?: string;
  waiter?: string;
  fishingType?: string;
  products?: Product[];
  total?: number;
  isActive?: boolean;
  isCancelled?: boolean;
  deliveryStatus?: IfoodDeliveryStatus;
  hasPendingOrders?: boolean;
  totalPayed?: number;
  createdAt?: string;
  waiterExtra?: number;
  paymentTypes?: string[];
  discount?: number;
  peopleCount?: number;
}
