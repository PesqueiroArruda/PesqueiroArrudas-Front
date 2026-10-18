import { destroyCookie, setCookie } from 'nookies';

const TWENTY_DAYS = 60 * 60 * 24 * 20;
const TWELVE_HOURS = 60 * 60 * 12;

export type Role = 'admin' | 'waiter' | 'user';

interface SessionData {
  token: string;
  isAdmin: boolean;
  role: Role;
  name: string;
}

// Identifica este aparelho. O backend só aceita o garçom em aparelhos que ele
// conhece (e o balcão pode bloquear um aparelho perdido).
export function getDeviceId(): string {
  try {
    const saved = localStorage.getItem('deviceId');
    if (saved) return saved;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('deviceId', id);
    return id;
  } catch (error) {
    return `volatile-${Date.now()}`;
  }
}

export function saveSession({ token, isAdmin, role, name }: SessionData) {
  localStorage.setItem('token', token);
  localStorage.setItem('isAdmin', String(isAdmin));
  localStorage.setItem('loggedUser', name);
  localStorage.setItem('role', role);

  // Os cookies só servem pra decidir o redirecionamento no servidor; quem
  // protege os dados de verdade é o backend, a cada requisição.
  const maxAge = role === 'waiter' ? TWELVE_HOURS : TWENTY_DAYS;
  setCookie(null, 'isAuthorized', 'true', { maxAge, path: '/' });
  setCookie(null, 'role', role, { maxAge, path: '/' });
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedUser');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('role');
  destroyCookie(null, 'isAuthorized', { path: '/' });
  destroyCookie(null, 'role', { path: '/' });
}

export function getStoredRole(): Role | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem('role') as Role | null) || null;
}
