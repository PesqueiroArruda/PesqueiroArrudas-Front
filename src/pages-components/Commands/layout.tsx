import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ListPlus, Loader2 } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { NavHeader } from './components/NavHeader';
import { CommandsList } from './components/CommandsList';

type Props = {
  handleOpenAddCommandModal: () => void;
  isLoading: boolean;
  commandStatusFilter: 'Ativas' | 'Pagas';
  setCommandStatusFilter: Dispatch<SetStateAction<'Ativas' | 'Pagas'>>;
  handleDownload: (e: any) => void;
};

export const CommandsLayout = ({
  handleOpenAddCommandModal,
  isLoading,
  commandStatusFilter,
  setCommandStatusFilter,
  handleDownload,
}: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Comandas</h1>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={commandStatusFilter}
              onChange={(e) => setCommandStatusFilter(e.target.value as 'Ativas' | 'Pagas')}
              className="h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Ativas</option>
              <option>Pagas</option>
            </select>
            {isAdmin && (
              <Button onClick={handleDownload} variant="secondary">
                Baixar Dados
              </Button>
            )}
            <Button onClick={handleOpenAddCommandModal}>
              <ListPlus className="h-4 w-4" />
              Adicionar Comanda
            </Button>
          </div>
        </div>

        <NavHeader />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <CommandsList />
        )}
      </div>
    </AppShell>
  );
};
