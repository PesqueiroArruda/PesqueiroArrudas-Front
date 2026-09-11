import { useEffect, useState } from 'react';
import {
  ArrowUp,
  BadgeCheck,
  ChefHat,
  Eye,
  EyeOff,
  ListPlus,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { Command } from 'types/Command';
import { parseToBRL } from 'utils/parseToBRL';

const listColumns = [
  { text: 'Mesa', prop: 'table' },
  { text: 'Garçom', prop: 'waiter' },
  { text: 'Total', prop: 'total' },
  { text: '', prop: '*' },
];

type Props = {
  allSalesWorth: number;
  items: any[];
  orderBy: string;
  orderByDir: 'asc' | 'desc';
  allSalesVisible: boolean;
  handleToggleAllSalesVisible: () => void;
  handleToggleOrderByDir: () => void;
  handleGoToCommandPage: ({ commandId }: { commandId: string }) => void;
  handleOpenAddProductsModal: (commandId: string) => void;
  handleOpenEditCommandModal: (command: Command) => void;
  handleOpenDeleteCommandModal: (commandId: string) => void;
};

export const CommandsListLayout = ({
  allSalesWorth,
  items,
  orderBy,
  orderByDir,
  allSalesVisible,
  handleToggleAllSalesVisible,
  handleToggleOrderByDir,
  handleGoToCommandPage,
  handleOpenAddProductsModal,
  handleOpenEditCommandModal,
  handleOpenDeleteCommandModal,
}: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 && isAdmin && (
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-navy sm:text-lg">
            Vendas de hoje: {allSalesVisible ? parseToBRL(allSalesWorth) : '•••••••'}
          </span>
          <button type="button" onClick={handleToggleAllSalesVisible} className="text-navy hover:text-cyan">
            {allSalesVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {listColumns.map(({ text, prop }) => (
              <TableHead key={`command-list-${text}-${prop}`}>
                <div className="flex items-center gap-2">
                  {text}
                  {orderBy.toLowerCase() === prop.toLowerCase() && (
                    <ArrowUp
                      onClick={handleToggleOrderByDir}
                      className={cn(
                        'h-4 w-4 cursor-pointer text-navy transition-transform',
                        orderByDir === 'desc' && 'rotate-180',
                      )}
                    />
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map(({ _id, table, waiter, total, fishingType, isActive, discount, hasPendingOrders }) => (
              <TableRow
                key={`list-command-${_id}`}
                className={cn(table?.startsWith('iFood #') && 'bg-destructive/10 hover:bg-destructive/15')}
              >
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
                    {isActive === false && (
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <span className="inline-block rounded-card border border-border bg-secondary px-4 py-2 text-lg font-bold text-navy">
                  Nenhuma comanda aberta!
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
