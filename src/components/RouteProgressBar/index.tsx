import { useEffect, useRef, useState } from 'react';

import { useRouteChanging } from 'hooks/useRouteChanging';

type Phase = 'idle' | 'loading' | 'done';

// Crawls toward (never reaching) 90% while a route change is in flight, then
// snaps to 100% and fades out once it completes — same shape as the classic
// top-of-page loading bar, built with plain CSS transitions (no extra dep).
export const RouteProgressBar = () => {
  const pendingPath = useRouteChanging();
  const [phase, setPhase] = useState<Phase>('idle');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (pendingPath) {
      setPhase('loading');
      return undefined;
    }

    setPhase((prev) => {
      if (prev !== 'loading') return prev;
      return 'done';
    });

    const resetTimeout = setTimeout(() => setPhase('idle'), 400);
    timeoutsRef.current.push(resetTimeout);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [pendingPath]);

  if (phase === 'idle') return null;

  const isDone = phase === 'done';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-gold"
        style={{
          width: isDone ? '100%' : '90%',
          opacity: isDone ? 0 : 1,
          transition: isDone
            ? 'width 150ms ease-out, opacity 300ms ease-out 150ms'
            : 'width 4s ease-out',
        }}
      />
    </div>
  );
};
