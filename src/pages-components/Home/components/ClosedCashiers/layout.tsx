import { DateTime } from 'luxon';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Cashier } from 'types/Cashier';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Dispatch, SetStateAction } from 'react';
import { parseToBRL } from 'utils/parseToBRL';
import { NavHeader } from './NavHeader';

const columns = ['Data', 'Total', 'Comandas', ''];
interface Props {
  allCashiers: Cashier[];
  handleGoToCashierPage: (cashierId: string) => void;
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
}

export const ClosedCashiersLayout = ({
  allCashiers,
  handleGoToCashierPage,
  handleDownloadCashiers,
  month,
  setMonth,
  setYear,
  year,
  isLoading,
}: Props) => {
  function formatDate(date: any) {
    const dt = DateTime.fromISO(date, { zone: 'pt-BR', setZone: true }).setLocale('pt-BR');
    return dt.toLocaleString(DateTime.DATE_FULL);
  }

  function renderRows() {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!allCashiers?.length) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <span className="inline-block rounded-card bg-secondary px-4 py-2 text-lg font-bold text-navy">
              Nenhum caixa fechado neste mês e ano
            </span>
          </TableCell>
        </TableRow>
      );
    }

    return allCashiers.map(({ _id, date, total, payments }) => (
      <TableRow key={`cashier-oflist-${_id}`}>
        <TableCell>{formatDate(date)}</TableCell>
        <TableCell>{parseToBRL(total || 0)}</TableCell>
        <TableCell>{payments?.length}</TableCell>
        <TableCell className="text-right">
          <button
            type="button"
            onClick={() => handleGoToCashierPage(_id)}
            className="inline-flex items-center gap-1.5 rounded-(--radius) bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground hover:bg-gold-strong"
          >
            Ver Mais
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <div className="flex flex-col gap-4">
      <NavHeader
        handleDownloadCashiers={handleDownloadCashiers}
        month={month}
        setMonth={setMonth}
        setYear={setYear}
        year={year}
        allCashiers={allCashiers}
      />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={`closed-cashier-column-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};
