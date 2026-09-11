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
  documentNumber?: string;
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

interface IfoodPaymentCard {
  brand?: string;
}

interface IfoodPaymentCash {
  changeFor?: number;
}

export interface IfoodPaymentMethod {
  method: string;
  type?: string;
  value: number;
  card?: IfoodPaymentCard;
  cash?: IfoodPaymentCash;
}

interface IfoodPayments {
  methods: IfoodPaymentMethod[];
}

export interface IfoodBenefit {
  value: number;
  sponsorshipValues?: { name: string; value: number }[];
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
  payments?: IfoodPayments;
  benefits?: IfoodBenefit[];
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

export interface IfoodCancellationReason {
  cancellationCode?: string;
  code?: string;
  description: string;
}

export interface IfoodOrder {
  _id: string;
  ifoodOrderId: string;
  eventId: string;
  rawPayload?: IfoodOrderPayload;
  status: 'pending' | 'accepted' | 'rejected' | 'cancellation_requested' | 'cancelled';
  commandId?: string | null;
  rejectionReason?: string;
  createdAt?: string;
}
