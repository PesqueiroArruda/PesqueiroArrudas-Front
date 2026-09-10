import { DateTime } from 'luxon';
import { BadgeCheck, ChefHat, Loader2, MoreVertical, Percent, Printer, Trash2, Wallet } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Command } from 'types/Command';
import { parseToBRL } from 'utils/parseToBRL';
import { NavHeader } from './components/NavHeader';
import { ProductsList } from './components/ProductsList';

interface Props {
  command: Command;
  isLoading: boolean;
  totalToBePayed: number;
  handleGoToCommands?: () => void;
  handleOpenPaymentModal: () => void;
  handleDeleteCommand: () => void;
  handleOpenSentToKitchenModal: () => void;
  handleOpenCloseCommandModal: () => void;
  handleEditDiscount: () => void;
  handlePrintCommand: () => void;
  isAdmin: boolean;
}

export const CommandLayout = ({
  command,
  isLoading,
  handleGoToCommands,
  handleOpenPaymentModal,
  handleDeleteCommand,
  handleOpenSentToKitchenModal,
  handleOpenCloseCommandModal,
  totalToBePayed,
  handleEditDiscount,
  handlePrintCommand,
  isAdmin,
}: Props) => {
  const dt = DateTime.fromISO(command?.createdAt as string, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');
  const createdAtFormatted = dt.toLocaleString(DateTime.DATETIME_MED);

  return (
    <AppShell hasBackPageBtn handleBackPage={handleGoToCommands}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex justify-center xl:justify-end">
            {command?.isActive === false ? (
              <span className="inline-flex items-center gap-2 rounded-card bg-success px-4 py-2 font-heading text-lg font-extrabold text-white">
                COMANDA PAGA
                <BadgeCheck className="h-5 w-5" />
              </span>
            ) : (
              <Button variant="secondary" onClick={handleOpenSentToKitchenModal}>
                Mandar para Cozinha
                <ChefHat className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col items-center gap-1.5 xl:items-start">
              <div className="w-full rounded-card bg-secondary px-4 py-2 text-center shadow-sm xl:w-auto">
                <h1 className="font-heading text-lg font-extrabold text-navy sm:text-xl">
                  Comanda: <span id="commandName">{command?.table}</span>
                </h1>
              </div>
              <span className="text-sm text-text-muted">{createdAtFormatted}</span>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto md:flex-row md:items-center">
              <div className="rounded-card bg-secondary px-4 py-2 text-center shadow-sm">
                <span className="font-heading text-base font-extrabold text-navy sm:text-lg">
                  Total: {parseToBRL(command?.total || 0)}
                </span>
              </div>
              <div className="rounded-card bg-secondary px-4 py-2 text-center shadow-sm">
                <span id="commandPrice" className="font-heading text-base font-extrabold text-navy sm:text-lg">
                  A Pagar: {parseToBRL(totalToBePayed || 0)}
                </span>
              </div>

              {isAdmin && (
                <>
                  <Button
                    onClick={handleOpenPaymentModal}
                    disabled={command.isActive === false}
                    variant="secondary"
                  >
                    <Wallet className="h-4 w-4" />
                    Pagar
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-10 items-center justify-center rounded-(--radius) border border-border bg-card px-3 text-navy shadow-sm hover:bg-secondary">
                      <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={handleOpenCloseCommandModal}
                        disabled={command.isActive === false}
                      >
                        <Wallet className="h-4 w-4" />
                        Fechar Comanda
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleEditDiscount} disabled={command.isActive === false}>
                        <Percent className="h-4 w-4" />
                        Editar Desconto
                      </DropdownMenuItem>
                      <DropdownMenuItem destructive onSelect={handleDeleteCommand}>
                        <Trash2 className="h-4 w-4" />
                        Deletar Comanda
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button onClick={handlePrintCommand} variant="secondary" size="icon" aria-label="Imprimir comanda">
                    <Printer className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {command?.isActive && <NavHeader />}
          <ProductsList isAdmin={isAdmin} />
        </div>
      )}
    </AppShell>
  );
};
