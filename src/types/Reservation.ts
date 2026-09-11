export type ReservationEnvironment = 'interno' | 'externo';
export type ReservationPaymentStatus = 'pending' | 'paid' | 'failed';
export type ReservationOperationalStatus = 'pendente' | 'compareceu' | 'nao_compareceu' | 'cancelada_cliente';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  environment: ReservationEnvironment;
  depositAmountCents: number;
  paymentStatus: ReservationPaymentStatus;
  operationalStatus: ReservationOperationalStatus;
  infinitepayInvoiceSlug: string | null;
  infinitepayTransactionNsu: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFilters {
  paymentStatus?: string;
  operationalStatus?: string;
  environment?: string;
  from?: string;
  to?: string;
  q?: string;
}
