import { Dispatch, SetStateAction } from 'react';
import { NavHeaderLayout } from './layout';

interface Props {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
}

export const NavHeader = ({ month, setMonth, setYear, year }: Props) => (
  <NavHeaderLayout month={month} setMonth={setMonth} setYear={setYear} year={year} />
);
