import { NextApiRequest } from 'next';
import nookies from 'nookies';

export function isAuthorizedRequest(req: NextApiRequest): boolean {
  const cookies = nookies.get({ req });
  // O garçom não acessa reservas nem usuários do cardápio.
  return Boolean(cookies.isAuthorized) && cookies.role !== 'waiter';
}
