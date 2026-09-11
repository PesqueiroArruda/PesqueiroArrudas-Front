export interface IfoodOrderItem {
  index: number;
  id: string;
  uniqueId: string;
  name: string;
  externalCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations?: string;
}

interface IfoodCustomer {
  id: string;
  name: string;
  phone?: { number?: string };
}

interface IfoodDeliveryAddress {
  formattedAddress?: string;
  neighborhood?: string;
  complement?: string;
  reference?: string;
}

interface IfoodDelivery {
  deliveredBy?: string;
  observations?: string;
  deliveryAddress?: IfoodDeliveryAddress;
}

interface IfoodOrderTotal {
  subTotal: number;
  deliveryFee: number;
  additionalFees: number;
  benefits: number;
  orderAmount: number;
}

export interface IfoodOrderPayload {
  id: string;
  displayId: string;
  createdAt: string;
  orderType: 'DELIVERY' | 'TAKEOUT' | 'INDOOR';
  isTest?: boolean;
  customer?: IfoodCustomer;
  delivery?: IfoodDelivery;
  items: IfoodOrderItem[];
  total: IfoodOrderTotal;
}

export interface ResolvedIfoodItem {
  ifoodItemId: string;
  externalCode: string;
  ifoodItemName: string;
  quantity: number;
  unitPrice: number;
  productId: string | null;
  saveMapping: boolean;
}

export interface IfoodOrder {
  _id: string;
  ifoodOrderId: string;
  eventId: string;
  rawPayload?: IfoodOrderPayload;
  status: 'pending' | 'accepted' | 'rejected';
  commandId?: string | null;
  rejectionReason?: string;
  createdAt?: string;
}
