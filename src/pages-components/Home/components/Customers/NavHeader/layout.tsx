import {Grid, Stack, Text, Select } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
}

const cashiersMonthOptions = [
  'Todos',
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const cashiersYearOptions = [
  'Todos',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2030',
];

export const NavHeaderLayout = ({
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter
}: Props) => !selectedMonthsFilter ? (
  <Stack gap={2}>
    <Grid gridTemplateColumns={['1fr 1fr']} gap={4}>
      <Stack color="blue.800">
        <Text fontWeight={600}>Mês</Text>
        <Select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          fontWeight={600}
        >
          {cashiersMonthOptions.map((m) => (
            <option key={`cashiers-month-${m}`}>{m}</option>
          ))}
        </Select>
      </Stack>
      <Stack color="blue.800">
        <Text fontWeight={600}>Ano</Text>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fontWeight={600}
        >
          {cashiersYearOptions.map((y) => (
            <option key={`cashiers-year-${y}`}>{y}</option>
          ))}
        </Select>
      </Stack>
    </Grid>
  </Stack>
) : null;
