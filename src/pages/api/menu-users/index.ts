import { NextApiRequest, NextApiResponse } from 'next';

import { supabaseAdmin } from 'lib/supabaseAdmin';
import { isAuthorizedRequest } from 'lib/reservationsAuth';
import { mapMenuUserRow, MenuUserRow } from 'lib/mapMenuUserRow';

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

  const { q } = req.query;

  let query = supabaseAdmin.from('menu_users').select('*').order('last_access_at', { ascending: false });

  const search = toSingle(q);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const menuUsers = (data as MenuUserRow[]).map(mapMenuUserRow);
  return res.status(200).json({ menuUsers });
}
