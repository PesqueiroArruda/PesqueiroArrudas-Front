import { memo } from 'react';
import { Ban, BadgeCheck, ChefHat, ListPlus, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { TableCell, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { parseToBRL } from 'utils/parseToBRL';

type Props = {
  _id: string;
  table: string;
  waiter: string;
  total: number;
  fishingType: string;
  isActive: boolean;
  isCancelled?: boolean;
  discount: number;
  hasPendingOrders?: boolean;
  isAdmin: boolean;
  handleGoToCommandPage: ({ commandId }: { commandId: string }) => void;
  handleOpenAddProductsModal: (commandId: string) => void;
  handleOpenEditCommandModal: (command: any) => void;
  handleOpenDeleteCommandModal: (commandId: string) => void;
};

export const CommandRow = memo(
  ({
    _id,
    table,
    waiter,
    total,
    fishingType,
    isActive,
    isCancelled,
    discount,
    hasPendingOrders,
    isAdmin,
    handleGoToCommandPage,
    handleOpenAddProductsModal,
    handleOpenEditCommandModal,
    handleOpenDeleteCommandModal,
  }: Props) => (
    <TableRow className={cn(table?.startsWith('iFood #') && 'bg-destructive/10 hover:bg-destructive/15')}>
      <TableCell className="cursor-pointer" onClick={() => handleGoToCommandPage({ commandId: _id })}>
        {table}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleGoToCommandPage({ commandId: _id })}>
        {waiter}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleGoToCommandPage({ commandId: _id })}>
        {parseToBRL(total - discount || 0)}
      </TableCell>
      <TableCell>
        {hasPendingOrders && <ChefHat className="h-5 w-5 text-destructive" />}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          {isCancelled && (
            <span className="inline-flex items-center gap-1.5 rounded-(--radius) bg-destructive px-2 py-1 text-sm font-bold text-white sm:px-3">
              <Ban className="h-4 w-4" />
              Cancelada (iFood)
            </span>
          )}
          {!isCancelled && isActive === false && (
            <span className="inline-flex items-center gap-1.5 rounded-(--radius) bg-success px-2 py-1 text-sm font-bold text-white sm:px-3">
              <BadgeCheck className="h-4 w-4" />
              Paga
            </span>
          )}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-(--radius) p-1 text-navy hover:bg-secondary">
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => handleOpenAddProductsModal(_id)}
                  disabled={isActive === false}
                >
                  <ListPlus className="h-4 w-4" />
                  Adicionar Produtos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOpenEditCommandModal({ _id, fishingType, table, waiter })}
                  disabled={isActive === false}
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem destructive onSelect={() => handleOpenDeleteCommandModal(_id)}>
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
);

CommandRow.displayName = 'CommandRow';
