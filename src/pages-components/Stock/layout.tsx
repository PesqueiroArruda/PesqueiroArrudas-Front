import { SetStateAction, Dispatch } from 'react';
import { useRouter } from 'next/router';
import {
  Merge,
  PackagePlus,
  ArrowUpDown,
  UtensilsCrossed,
  MoreVertical,
} from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { NavHeader } from './components/NavHeader';
import { ItemsTable } from './components/ItemsTable';

interface Props {
  filters: string;
  setFilters: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setIsAddItemModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsMergeDuplicatesModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsAutoOrderModalOpen: Dispatch<SetStateAction<boolean>>;
  handleGoToHome: () => void;
  handleDownload: (e: any) => void;
}

export const StockLayout = ({
  filters,
  setFilters,
  orderBy,
  setOrderBy,
  setIsAddItemModalOpen,
  setIsMergeDuplicatesModalOpen,
  setIsAutoOrderModalOpen,
  handleGoToHome,
  handleDownload,
}: Props) => {
  const router = useRouter();

  return (
    <AppShell hasBackPageBtn handleBackPage={handleGoToHome}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
            Estoque
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              Baixar Dados
            </Button>
            <Button
              onClick={() => setIsMergeDuplicatesModalOpen(true)}
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              <Merge className="h-4 w-4" />
              Juntar Duplicados
            </Button>
            <Button
              onClick={() => setIsAutoOrderModalOpen(true)}
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              <ArrowUpDown className="h-4 w-4" />
              Auto-ordenar Cardápio
            </Button>
            <Button
              onClick={() => router.push('/menu-organization')}
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Organizar Cardápio
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-(--radius) border border-input bg-card text-foreground shadow-sm hover:bg-secondary sm:hidden">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Mais ações</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleDownload}>
                  Baixar Dados
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setIsMergeDuplicatesModalOpen(true)}
                >
                  Juntar Duplicados
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setIsAutoOrderModalOpen(true)}
                >
                  Auto-ordenar Cardápio
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push('/menu-organization')}
                >
                  Organizar Cardápio
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsAddItemModalOpen(true)}>
              <PackagePlus className="h-4 w-4" />
              Adicionar Item
            </Button>
          </div>
        </div>
        <NavHeader
          filters={filters}
          setFilters={setFilters}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
        <ItemsTable />
      </div>
    </AppShell>
  );
};
