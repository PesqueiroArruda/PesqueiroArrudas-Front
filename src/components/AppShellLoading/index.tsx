import { Loader2 } from 'lucide-react';

import { AppShell } from 'components/AppShell';

// Renders the sidebar/topbar chrome immediately instead of `return null`
// while a page's client-only role check (localStorage `isAdmin`) is still
// resolving, so navigating between admin-gated pages doesn't flash to a
// blank screen before the real content mounts.
export const AppShellLoading = () => (
  <AppShell>
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
    </div>
  </AppShell>
);
