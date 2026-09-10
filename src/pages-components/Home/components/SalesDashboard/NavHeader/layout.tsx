import { Dispatch, SetStateAction } from 'react';

interface Props {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
}

const monthOptions = [
  'Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const yearOptions = ['Todos', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2030'];

const selectClassName =
  'h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const NavHeaderLayout = ({ month, setMonth, setYear, year }: Props) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-navy">Mês</span>
      <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClassName}>
        {monthOptions.map((m) => (
          <option key={`sales-dashboard-month-${m}`}>{m}</option>
        ))}
      </select>
    </div>
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-navy">Ano</span>
      <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClassName}>
        {yearOptions.map((y) => (
          <option key={`sales-dashboard-year-${y}`}>{y}</option>
        ))}
      </select>
    </div>
  </div>
);
