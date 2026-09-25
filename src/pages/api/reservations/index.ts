import { NextApiRequest, NextApiResponse } from 'next';

import { supabaseAdmin } from 'lib/supabaseAdmin';
import { isAuthorizedRequest } from 'lib/reservationsAuth';
import { mapReservationRow, ReservationRow } from 'lib/mapReservationRow';
import { getAvailableSpots } from 'lib/reservationCapacity';
import { ReservationEnvironment } from 'types/Reservation';

const VALID_ENVIRONMENTS: ReservationEnvironment[] = [
  'interno',
  'quiosque',
  'externo',
];
const VALID_PAYMENT_STATUSES = ['paid', 'pending'];

function toList(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  return raw.split(',').filter(Boolean);
}

function toSingle(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (req.method === 'POST') {
    return handleCreate(req, res);
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentStatus, operationalStatus, environment, from, to, q } =
    req.query;

  let query = supabaseAdmin
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true });

  const paymentStatusList = toList(paymentStatus);
  if (paymentStatusList) query = query.in('payment_status', paymentStatusList);

  const operationalStatusList = toList(operationalStatus);
  if (operationalStatusList)
    query = query.in('operational_status', operationalStatusList);

  const environmentList = toList(environment);
  if (environmentList) query = query.in('environment', environmentList);

  const fromDate = toSingle(from);
  if (fromDate) query = query.gte('reservation_date', fromDate);

  const toDate = toSingle(to);
  if (toDate) query = query.lte('reservation_date', toDate);

  const search = toSingle(q);
  if (search)
    query = query.or(
      `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`
    );

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const reservations = (data as ReservationRow[]).map(mapReservationRow);
  return res.status(200).json({ reservations });
}

// Cria uma reserva feita "na mão" pelo estabelecimento (cliente que liga ou avisa
// pessoalmente), fora do checkout público. Segue o mesmo objeto de criação da
// landing page (src/app/actions/reservations.ts) — mesmas colunas da tabela
// `reservations` — mas sem InfinitePay: paymentStatus vem escolhido no formulário
// (pago ou pendente) em vez de nascer sempre "pending" esperando o link de pagamento,
// e não há deposit collected online, então deposit_amount_cents fica em 0.
async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const {
    customerName,
    customerPhone,
    reservationDate,
    reservationTime,
    partySize,
    environment,
    paymentStatus,
    notes,
  } = req.body || {};

  if (typeof customerName !== 'string' || !customerName.trim()) {
    return res.status(400).json({ message: 'Informe o nome do cliente' });
  }
  if (typeof customerPhone !== 'string' || !customerPhone.trim()) {
    return res.status(400).json({ message: 'Informe o telefone do cliente' });
  }
  if (
    typeof reservationDate !== 'string' ||
    Number.isNaN(Date.parse(reservationDate))
  ) {
    return res.status(400).json({ message: 'Data inválida' });
  }
  if (typeof reservationTime !== 'string' || !reservationTime.trim()) {
    return res.status(400).json({ message: 'Informe o horário' });
  }
  const partySizeNumber = Number(partySize);
  if (!Number.isInteger(partySizeNumber) || partySizeNumber < 1) {
    return res.status(400).json({ message: 'Quantidade de pessoas inválida' });
  }
  if (!VALID_ENVIRONMENTS.includes(environment)) {
    return res.status(400).json({ message: 'Ambiente inválido' });
  }
  if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
    return res.status(400).json({ message: 'Status de pagamento inválido' });
  }

  try {
    const availableSpots = await getAvailableSpots(
      reservationDate,
      environment
    );
    if (paymentStatus === 'paid' && partySizeNumber > availableSpots) {
      const message =
        availableSpots > 0
          ? `Esse ambiente já está quase lotado nesse dia. Restam apenas ${availableSpots} vaga${
              availableSpots === 1 ? '' : 's'
            }.`
          : 'Esse ambiente já está com a capacidade esgotada para esse dia. Escolha outro ambiente ou outra data.';
      return res.status(400).json({ message });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || 'Não foi possível checar a disponibilidade',
    });
  }

  const { data, error } = await supabaseAdmin
    .from('reservations')
    .insert({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      party_size: partySizeNumber,
      environment,
      deposit_amount_cents: 0,
      payment_status: paymentStatus,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    })
    .select()
    .single();

  if (error || !data) {
    return res
      .status(500)
      .json({ message: error?.message || 'Não foi possível criar a reserva' });
  }

  return res
    .status(201)
    .json({ reservation: mapReservationRow(data as ReservationRow) });
}
