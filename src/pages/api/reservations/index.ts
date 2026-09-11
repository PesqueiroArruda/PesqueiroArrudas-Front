import { NextApiRequest, NextApiResponse } from 'next';

import { supabaseAdmin } from 'lib/supabaseAdmin';
import { isAuthorizedRequest } from 'lib/reservationsAuth';
import { mapReservationRow, ReservationRow } from 'lib/mapReservationRow';

function toList(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  return raw.split(',').filter(Boolean);
}

function toSingle(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentStatus, operationalStatus, environment, from, to, q } = req.query;

  let query = supabaseAdmin
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true });

  const paymentStatusList = toList(paymentStatus);
  if (paymentStatusList) query = query.in('payment_status', paymentStatusList);

  const operationalStatusList = toList(operationalStatus);
  if (operationalStatusList) query = query.in('operational_status', operationalStatusList);

  const environmentList = toList(environment);
  if (environmentList) query = query.in('environment', environmentList);

  const fromDate = toSingle(from);
  if (fromDate) query = query.gte('reservation_date', fromDate);

  const toDate = toSingle(to);
  if (toDate) query = query.lte('reservation_date', toDate);

  const search = toSingle(q);
  if (search) query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const reservations = (data as ReservationRow[]).map(mapReservationRow);
  return res.status(200).json({ reservations });
}
