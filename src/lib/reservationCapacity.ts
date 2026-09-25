import { supabaseAdmin } from 'lib/supabaseAdmin';
import { ReservationEnvironment } from 'types/Reservation';

if (typeof window !== 'undefined') {
  throw new Error(
    'reservationCapacity must only be imported from API routes, never from client code.'
  );
}

// Mantém em sincronia com ENVIRONMENT_CAPACITY em src/lib/reservations.ts no repo
// pesqueiro-landing-page — é a mesma tabela `reservations` no Supabase, então os dois
// precisam concordar sobre quantas pessoas cabem em cada ambiente por dia.
export const ENVIRONMENT_CAPACITY: Record<ReservationEnvironment, number> = {
  interno: 60,
  quiosque: 30,
  externo: 80,
};

// Mesma lógica de src/lib/capacity.ts (getAvailableSpots) da landing page: soma
// party_size das reservas pagas do dia+ambiente e subtrai da capacidade fixa.
// Só conta payment_status = "paid" — reservas pendentes não seguram vaga.
export async function getAvailableSpots(
  date: string,
  environment: ReservationEnvironment
): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('reservations')
    .select('party_size')
    .eq('reservation_date', date)
    .eq('environment', environment)
    .eq('payment_status', 'paid');

  if (error) throw error;

  const occupied = (data ?? []).reduce(
    (sum, row: { party_size: number }) => sum + row.party_size,
    0
  );
  return ENVIRONMENT_CAPACITY[environment] - occupied;
}
