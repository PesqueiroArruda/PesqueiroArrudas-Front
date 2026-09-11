import { Reservation, ReservationOperationalStatus } from 'types/Reservation';

export interface ReservationRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  environment: Reservation['environment'];
  deposit_amount_cents: number;
  payment_status: Reservation['paymentStatus'];
  operational_status: ReservationOperationalStatus | null;
  infinitepay_invoice_slug: string | null;
  infinitepay_transaction_nsu: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapReservationRow(row: ReservationRow): Reservation {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    reservationDate: row.reservation_date,
    reservationTime: row.reservation_time,
    partySize: row.party_size,
    environment: row.environment,
    depositAmountCents: row.deposit_amount_cents,
    paymentStatus: row.payment_status,
    operationalStatus: row.operational_status || 'pendente',
    infinitepayInvoiceSlug: row.infinitepay_invoice_slug,
    infinitepayTransactionNsu: row.infinitepay_transaction_nsu,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
