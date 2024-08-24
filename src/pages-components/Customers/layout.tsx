/* eslint-disable react/destructuring-assignment */
import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  Table,
  Tr,
  Td,
  Thead,
  TableContainer,
  Th,
  Tbody,
} from '@chakra-ui/react';
import { Header } from 'components/Header';
import { Layout } from 'components/Layout';
import { DateTime } from 'luxon';
// eslint-disable-next-line import/named
import { Cashier, CashierPayment } from 'types/Cashier';

interface Props {
  cashier: Cashier;
  handleBackPage: () => void;
  isLoading: boolean;
  payments: CashierPayment[];
}


export const CustomersLayout = ({
  cashier,
  handleBackPage,
  isLoading
}: Props) => {
  const dt = DateTime.fromISO(cashier?.date, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');
  const columns = ['Cliente', 'Quantidade de visitas', 'Valor total gasto'];

  const totalItemsSold = cashier?.payments?.length

  const allCommands: any = []

  cashier?.payments?.forEach(payment => {
    allCommands.push({ name: payment?.command?.table?.trim().toLowerCase(), total: payment?.totalPayed})
  })

  function contarNomesRepetidos(nomes: any) {
    const contagem : any = {};

    nomes.forEach((item: any) => {
        const nome = item.name
        const {total} = item

        if (contagem[nome]) {
            contagem[nome].total += total
            contagem[nome].ocorrencias += 1
        } else {
            contagem[nome] = { total, ocorrencias: 1 }
        }
    });

    const contagemArray = Object.entries(contagem);

    contagemArray.sort((a: any, b: any) => {
        if (b[1].ocorrencias !== a[1].ocorrencias) {
            return b[1].ocorrencias - a[1].ocorrencias
        }
        return b[1].total - a[1].total
    });

    // Mapeia para o formato desejado
    const resultado = contagemArray.map(([nome, info] : [nome: any, info: any]) => ({
        name: nome,
        total: info.total,
        ocorrencias: info.ocorrencias
    }));

    return resultado;
  }

  const result = contarNomesRepetidos(allCommands)

  // verifyProductsQuantity()

  return (
    <Layout>
      <Header hasBackPageBtn handleBackPage={handleBackPage} />
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <>
        <Flex
            justify={['center', 'center', 'space-between']}
            flexWrap="wrap"
            gap={4}
            align="center"
          >
            <Heading fontSize={[18, 22, 26]} color="blue.800" fontWeight={600}>
              {cashier?.date ? (
                <>
                  Clientes do dia:{' '}
                  <BoldText>{dt.toLocaleString(DateTime.DATE_FULL)}</BoldText>
                </>
              ) : (
                <>
                  Clientes de:{' '}
                  <BoldText>{cashier.month} de {cashier.year}</BoldText>
                </>
              )}
              
            </Heading>
            <Box bg="blue.400" p={1} px={[2, 4]} rounded={4}>
              <Text fontSize={[20, 22]} color="blue.50">
                Total de comandas :{' '}
                <BoldText color="blue.50">
                  {Math.round(totalItemsSold * 100) / 100}
                </BoldText>
              </Text>
            </Box>
          </Flex>
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
            {result.map((command: any) => (
              <Tr key={`sold-items-oflist-${Math.random()}`}>
                <Td>{command.name.charAt(0).toUpperCase() + command.name.slice(1)}</Td>
                <Td>{command.ocorrencias}</Td>
                <Td>R$ {command.total.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
        </>
      )}
    </Layout>
  );
};


const BoldText = (props: any) => (
  <Box as="span" color="blue.600" fontWeight={700} {...props}>
    {props.children}
  </Box>
);