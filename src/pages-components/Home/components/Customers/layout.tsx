/* eslint-disable */
import {
  Button,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Heading,
  Switch,
  Flex,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { Cashier, CashierByMonth } from 'types/Cashier';

import { MdOutlineReadMore } from 'react-icons/md';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { NavHeader } from './NavHeader';

const columns = ['Data', 'Total de comandas', ''];
interface Props {
  allCashiers: Cashier[];
  handleGoToCustomersPage: (cashierId: string, cashierByMonthObject?: CashierByMonth) => void;
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
  cashiersFilteredByMonth: CashierByMonth[];
}

export const CustomersLayout = ({
  allCashiers,
  handleGoToCustomersPage,
  handleDownloadCashiers,
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter,
  cashiersFilteredByMonth
}: Props) => {
  function formatDate(date: any) {
    const dt = DateTime.fromISO(date, {
      zone: 'pt-BR',
      setZone: true,
    }).setLocale('pt-BR');
    return dt.toLocaleString(DateTime.DATE_FULL);
  }

  return (
    <Stack>
      <Flex alignItems="center">
        <Heading as="h2" fontSize={[20, 24]} color="blue.900" flex="1">
          Clientes recorrentes
        </Heading>
      </Flex>

      <NavHeader
        month={month}
        setMonth={setMonth}
        setYear={setYear}
        year={year}
        selectedMonthsFilter={selectedMonthsFilter}
      />
      <TableContainer>
        <Table size="lg">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={`closed-cashier-column-${column}`}>{column}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {allCashiers?.length > 0 ? (
              allCashiers?.map(({ _id, date, payments }) => {
                let productsAmount = 0
                payments.forEach(item => item.command.products.forEach(product => productsAmount += product.amount))
                return (
                  <Tr key={`cashier-oflist-${_id}`}>
                  <Td>{formatDate(date)}</Td>
                  <Td>{Math.round(productsAmount * 100) / 100}</Td>
                  <Td isNumeric>
                    <Button
                      onClick={() => handleGoToCustomersPage(_id, undefined)}
                      colorScheme="blue"
                      fontSize={[14, 16]}
                    >
                      Ver Mais{' '}
                      <Icon as={MdOutlineReadMore} ml={2} fontSize={[16, 18]} />
                    </Button>
                  </Td>
                </Tr>
                )
              })
            ) : cashiersFilteredByMonth.length > 0  ? (
                cashiersFilteredByMonth?.map((cashier) => { 
                  let productsAmount = cashier.payments.length
                  return (
                    <Tr key={`cashier-oflist-${cashier._id}`}>
                    <Td>{cashier.month} de {cashier.year}</Td>
                    <Td>{Math.round(productsAmount * 100) / 100}</Td>
                    <Td isNumeric>
                      <Button
                        onClick={() => handleGoToCustomersPage(cashier._id, cashier)}
                        colorScheme="blue"
                        fontSize={[14, 16]}
                      >
                        Ver Mais{' '}
                        <Icon as={MdOutlineReadMore} ml={2} fontSize={[16, 18]} />
                      </Button>
                    </Td>
                  </Tr>
                  )
                }
                )
            ) : (
              <Tr>
                <Td w="100%">
                  <Heading
                    as="span"
                    fontSize={[18, 20, 24]}
                    color="blue.700"
                    bg="blue.50"
                    rounded={4}
                    py={2}
                    px={4}
                  >
                    Nenhuma comanda encontrada
                  </Heading>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
