import { NextApiRequest } from 'next';
import nookies from 'nookies';

export function isAuthorizedRequest(req: NextApiRequest): boolean {
  const cookies = nookies.get({ req });
  return Boolean(cookies.isAuthorized);
}
