import { Dispatch, SetStateAction } from 'react';
import { Download } from 'lucide-react';

import { Button } from 'components/ui/button';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  totalValue: number;
  totalCommands: number;
}

const cashiersMonthOptions = [
  'Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const cashiersYearOptions = ['Todos', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2030'];

const selectClassName =
  'h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const NavHeaderLayout = ({
  handleDownloadCashiers,
  month,
  setMonth,
  setYear,
  year,
  totalCommands,
  totalValue,
}: Props) => (
  <div className="flex flex-col gap-3">
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Mês</span>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClassName}>
          {cashiersMonthOptions.map((m) => (
            <option key={`cashiers-month-${m}`}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Ano</span>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClassName}>
          {cashiersYearOptions.map((y) => (
            <option key={`cashiers-year-${y}`}>{y}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="flex w-full gap-4">
      <p className="flex-1 rounded-card bg-secondary px-4 py-2 text-center text-sm font-bold text-navy">
        Valor Total: {parseToBRL(totalValue || 0)}
      </p>
      <p className="flex-1 rounded-card bg-secondary px-4 py-2 text-center text-sm font-bold text-navy">
        Comandas: {totalCommands}
      </p>
    </div>
    <Button onClick={handleDownloadCashiers} variant="secondary">
      Baixar Caixas
      <Download className="h-4 w-4" />
    </Button>
  </div>
);
