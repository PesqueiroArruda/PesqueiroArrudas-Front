import { useEffect, useState } from 'react';
import { ArrowUp, Eye, EyeOff } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { Command } from 'types/Command';
import { parseToBRL } from 'utils/parseToBRL';
import { CommandRow } from './CommandRow';

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
            VH: {allSalesVisible ? parseToBRL(allSalesWorth) : '•••••••'}
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
            items.map((command) => (
              <CommandRow
                key={`list-command-${command._id}`}
                {...command}
                isAdmin={isAdmin}
                handleGoToCommandPage={handleGoToCommandPage}
                handleOpenAddProductsModal={handleOpenAddProductsModal}
                handleOpenEditCommandModal={handleOpenEditCommandModal}
                handleOpenDeleteCommandModal={handleOpenDeleteCommandModal}
              />
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
