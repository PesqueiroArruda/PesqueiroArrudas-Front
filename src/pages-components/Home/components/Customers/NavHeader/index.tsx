import { Dispatch, SetStateAction } from 'react';
import { NavHeaderLayout } from './layout';

interface Props {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
}

export const NavHeader = ({
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter
}: Props) => (
    <NavHeaderLayout
      month={month}
      setMonth={setMonth}
      setYear={setYear}
      year={year}
      selectedMonthsFilter={selectedMonthsFilter}
    />
  );
