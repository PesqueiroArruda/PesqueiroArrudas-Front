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
import { Dispatch, SetStateAction, ChangeEvent, useState } from 'react';
import { NavHeader } from './NavHeader';

const columns = ['Data', 'Total itens vendidos', ''];
interface Props {
  allCashiers: Cashier[];
  handleGoToSoldItemsPage: (cashierId: string) => void;
  handleDownloadCashiers: (e: any) => void;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  selectedMonthsFilter: boolean;
  setSelectedMonthsFilter: any;
  cashiersFilteredByMonth: CashierByMonth[];
}

export const SoldItemsLayout = ({
  allCashiers,
  handleGoToSoldItemsPage,
  handleDownloadCashiers,
  month,
  setMonth,
  setYear,
  year,
  selectedMonthsFilter,
  setSelectedMonthsFilter,
  cashiersFilteredByMonth
}: Props) => {
  function formatDate(date: any) {
    const dt = DateTime.fromISO(date, {
      zone: 'pt-BR',
      setZone: true,
    }).setLocale('pt-BR');
    return dt.toLocaleString(DateTime.DATE_FULL);
  }

  const handleSelectDaysOrMonths = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedMonthsFilter(event.target.checked)
  }

  return (
    <Stack>
      <Flex alignItems="center">
        <Heading as="h2" fontSize={[20, 24]} color="blue.900" flex="1">
          Itens Vendidos
        </Heading>
        <Flex alignItems="center" gap={2}>
          <Heading as="h2" fontSize={[20, 24]} color="blue.900" flex="1">
            Dias
          </Heading>
          <Switch id='days-or-months' isChecked={selectedMonthsFilter}  onChange={handleSelectDaysOrMonths}/>
          <Heading as="h2" fontSize={[20, 24]} color="blue.900" flex="1">
            Meses
          </Heading>
        </Flex>
      </Flex>

      <NavHeader
        handleDownloadCashiers={handleDownloadCashiers}
        month={month}
        setMonth={setMonth}
        setYear={setYear}
        year={year}
        allCashiers={allCashiers}
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
                      onClick={() => handleGoToSoldItemsPage(_id)}
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
                  let productsAmount = 0
                  cashier.payments.forEach(item => item.command.products.forEach(product => productsAmount += product.amount))
                  return (
                    <Tr key={`cashier-oflist-${cashier._id}`}>
                    <Td>{cashier.month} de {cashier.year}</Td>
                    <Td>{Math.round(productsAmount * 100) / 100}</Td>
                    <Td isNumeric>
                      <Button
                        onClick={() => handleGoToSoldItemsPage(cashier._id, cashier)}
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
                    Nenhum item encontrado
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
