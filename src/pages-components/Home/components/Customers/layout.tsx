import { DateTime } from 'luxon';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Cashier, CashierByMonth } from 'types/Cashier';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Dispatch, SetStateAction } from 'react';
import { NavHeader } from './NavHeader';

const columns = ['Data', 'Total de comandas', ''];
interface Props {
  allCashiers: Cashier[];
  handleGoToCustomersPage: (cashierId: string, cashierByMonthObject?: CashierByMonth) => void;
  // eslint-disable-next-line react/no-unused-prop-types -- kept to match the caller's prop contract
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
  cashiersFilteredByMonth: CashierByMonth[];
  isLoading: boolean;
}

export const CustomersLayout = ({
  allCashiers,
  handleGoToCustomersPage,
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter,
  cashiersFilteredByMonth,
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
                onClick={() => handleGoToCustomersPage(_id, undefined)}
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
        const productsAmount = cashier.payments.length;
        return (
          <TableRow key={`cashier-oflist-${cashier._id}`}>
            <TableCell>
              {cashier.month} de {cashier.year}
            </TableCell>
            <TableCell>{Math.round(productsAmount * 100) / 100}</TableCell>
            <TableCell className="text-right">
              <button
                type="button"
                onClick={() => handleGoToCustomersPage(cashier._id, cashier)}
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
            Nenhuma comanda encontrada
          </span>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-extrabold text-navy">Clientes recorrentes</h2>

      <NavHeader month={month} setMonth={setMonth} setYear={setYear} year={year} selectedMonthsFilter={selectedMonthsFilter} />

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={`customers-column-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};
