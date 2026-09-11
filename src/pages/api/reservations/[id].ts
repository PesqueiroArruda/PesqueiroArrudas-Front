import { NextApiRequest, NextApiResponse } from 'next';

import { supabaseAdmin } from 'lib/supabaseAdmin';
import { ReservationOperationalStatus } from 'types/Reservation';
import { isAuthorizedRequest } from 'lib/reservationsAuth';
import { mapReservationRow, ReservationRow } from 'lib/mapReservationRow';

const VALID_OPERATIONAL_STATUSES: ReservationOperationalStatus[] = [
  'pendente',
  'compareceu',
  'nao_compareceu',
  'cancelada_cliente',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('reservations').select('*').eq('id', id).single();

    if (error || !data) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.status(200).json({ reservation: mapReservationRow(data as ReservationRow) });
  }

  if (req.method === 'PATCH') {
    // Only operational_status is mutable through this API by design — do not add other writable
    // fields here. Creating/paying reservations stays exclusively the institutional site's job.
    const { operationalStatus } = req.body || {};

    if (!VALID_OPERATIONAL_STATUSES.includes(operationalStatus)) {
      return res.status(400).json({ message: 'Invalid operationalStatus' });
    }

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .update({ operational_status: operationalStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({ message: error?.message || 'Failed to update reservation' });
    }

    return res.status(200).json({ reservation: mapReservationRow(data as ReservationRow) });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
