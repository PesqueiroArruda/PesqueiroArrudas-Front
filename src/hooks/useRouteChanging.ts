import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Path being navigated to, or null when no navigation is in flight. next/router
// only fires routeChangeStart/Complete/Error for the route currently changing,
// so this is the single source of truth for any "is a page load happening"
// UI (progress bar, nav item spinner, etc).
export const useRouteChanging = () => {
  const router = useRouter();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    const handleStart = (url: string) => setPendingPath(url);
    const handleDone = () => setPendingPath(null);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleDone);
    router.events.on('routeChangeError', handleDone);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleDone);
      router.events.off('routeChangeError', handleDone);
    };
  }, [router]);

  return pendingPath;
};
