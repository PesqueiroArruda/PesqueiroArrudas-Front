export interface MenuUser {
  id: string;
  googleId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  marketingConsent: boolean;
  createdAt: string;
  lastAccessAt: string;
}

export interface MenuUserFilters {
  q?: string;
}
