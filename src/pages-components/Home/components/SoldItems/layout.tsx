import { DateTime } from 'luxon';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Cashier, CashierByMonth } from 'types/Cashier';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { NavHeader } from './NavHeader';

const columns = ['Data', 'Total itens vendidos', ''];
interface Props {
  allCashiers: Cashier[];
  handleGoToSoldItemsPage: (cashierId: string, cashierByMonthObject?: CashierByMonth) => void;
  // eslint-disable-next-line react/no-unused-prop-types -- kept to match the caller's prop contract
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
  setSelectedMonthsFilter: any;
  cashiersFilteredByMonth: CashierByMonth[];
  isLoading: boolean;
}

export const SoldItemsLayout = ({
  allCashiers,
  handleGoToSoldItemsPage,
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter,
  setSelectedMonthsFilter,
  cashiersFilteredByMonth,
  isLoading,
}: Props) => {
  function formatDate(date: any) {
    const dt = DateTime.fromISO(date, { zone: 'pt-BR', setZone: true }).setLocale('pt-BR');
    return dt.toLocaleString(DateTime.DATE_FULL);
  }

  const handleSelectDaysOrMonths = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedMonthsFilter(event.target.checked);
  };

  function renderRows() {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3}>
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (allCashiers?.length > 0) {
      return allCashiers.map(({ _id, date, payments }) => {
        let productsAmount = 0;
        payments.forEach((item) =>
          item.command.products.forEach((product) => {
            productsAmount += product.amount;
          }),
        );
        return (
          <TableRow key={`cashier-oflist-${_id}`}>
            <TableCell>{formatDate(date)}</TableCell>
            <TableCell>{Math.round(productsAmount * 100) / 100}</TableCell>
            <TableCell className="text-right">
              <button
                type="button"
                onClick={() => handleGoToSoldItemsPage(_id, undefined)}
                className="inline-flex items-center gap-1.5 rounded-(--radius) bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground hover:bg-gold-strong"
              >
                Ver Mais
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </TableCell>
          </TableRow>
        );
      });
    }

    if (cashiersFilteredByMonth.length > 0) {
      return cashiersFilteredByMonth.map((cashier) => {
        let productsAmount = 0;
        cashier.payments.forEach((item) =>
          item.command.products.forEach((product) => {
            productsAmount += product.amount;
          }),
        );
        return (
          <TableRow key={`cashier-oflist-${cashier._id}`}>
            <TableCell>
              {cashier.month} de {cashier.year}
            </TableCell>
            <TableCell>{Math.round(productsAmount * 100) / 100}</TableCell>
            <TableCell className="text-right">
              <button
                type="button"
                onClick={() => handleGoToSoldItemsPage(cashier._id, cashier)}
                className="inline-flex items-center gap-1.5 rounded-(--radius) bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground hover:bg-gold-strong"
              >
                Ver Mais
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </TableCell>
          </TableRow>
        );
      });
    }

    return (
      <TableRow>
        <TableCell colSpan={3}>
          <span className="inline-block rounded-card bg-secondary px-4 py-2 text-lg font-bold text-navy">
            Nenhum item encontrado
          </span>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-extrabold text-navy">Itens Vendidos</h2>
        <label htmlFor="sold-items-months-toggle" className="flex items-center gap-2.5 text-sm font-bold text-navy">
          Dias
          <span className="relative inline-flex h-5 w-9 items-center">
            <input
              id="sold-items-months-toggle"
              type="checkbox"
              checked={selectedMonthsFilter}
              onChange={handleSelectDaysOrMonths}
              className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-secondary transition-colors peer-checked:bg-gold" />
            <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
          Meses
        </label>
      </div>

      <NavHeader month={month} setMonth={setMonth} setYear={setYear} year={year} selectedMonthsFilter={selectedMonthsFilter} />

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={`sold-items-column-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};
