import { SetStateAction, Dispatch } from 'react';
import { PackagePlus } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { NavHeader } from './components/NavHeader';
import { ItemsTable } from './components/ItemsTable';

interface Props {
  filters: string;
  setFilters: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setIsAddItemModalOpen: Dispatch<SetStateAction<boolean>>;
  handleGoToHome: () => void;
  handleDownload: (e: any) => void;
}

export const StockLayout = ({
  filters,
  setFilters,
  orderBy,
  setOrderBy,
  setIsAddItemModalOpen,
  handleGoToHome,
  handleDownload,
}: Props) => (
  <AppShell hasBackPageBtn handleBackPage={handleGoToHome}>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Estoque</h1>
        <div className="flex gap-3">
          <Button onClick={handleDownload} variant="secondary">
            Baixar Dados
          </Button>
          <Button onClick={() => setIsAddItemModalOpen(true)}>
            <PackagePlus className="h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </div>
      <NavHeader filters={filters} setFilters={setFilters} orderBy={orderBy} setOrderBy={setOrderBy} />
      <ItemsTable />
    </div>
  </AppShell>
);
