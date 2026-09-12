import { MenuUser } from 'types/MenuUser';

export interface MenuUserRow {
  id: string;
  google_id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  marketing_consent: boolean;
  created_at: string;
  last_access_at: string;
}

export function mapMenuUserRow(row: MenuUserRow): MenuUser {
  return {
    id: row.id,
    googleId: row.google_id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    marketingConsent: row.marketing_consent,
    createdAt: row.created_at,
    lastAccessAt: row.last_access_at,
  };
}
