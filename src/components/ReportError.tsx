import { AlertTriangle } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';

interface Props {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ReportError = ({ message, onRetry, onBack }: Props) => (
  <AppShell hasBackPageBtn handleBackPage={onBack}>
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2 rounded-card border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message}
      </div>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  </AppShell>
);
