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
import { Cashier, CashierPayment, CashierProduct } from 'types/Cashier';
import { Product } from 'types/Product';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  cashier: Cashier;
  handleBackPage: () => void;
  isLoading: boolean;
  payments: CashierPayment[];
  products: Product[];
}

interface ProductRenderProps {
  _id: string;
  name: string;
  totalAmount: number;
  commandsAppears: number;
  totalPrice: number;
}

export const SoldItemsLayout = ({
  cashier,
  handleBackPage,
  isLoading,
  products
}: Props) => {
  const dt = DateTime.fromISO(cashier?.date, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');
  const columns = ['Item', 'Quantidade vendido', 'Total vendido', 'Ocorrências em comandas'];

  let totalItemsSold = 0
  const allProducts : CashierProduct[] = []
  const productsFilteres : ProductRenderProps[] = []

  cashier?.payments?.forEach(payment => {
    payment.command.products.forEach(product => {
      totalItemsSold += product.amount
    })
  })

  cashier?.payments?.forEach(payment => {
    payment.command.products.forEach(product => {
        allProducts.push({
        _id: product._id,
        name: product.name,
        amount: product.amount,
      })
    })
  })

  const verifyProductsQuantity = () => {
    allProducts.forEach(product => {
      let productTotalAmount = 0
      const filteredProductsById = allProducts.filter(item => item._id === product._id)
      const commandsItemsAppears = filteredProductsById.length
      const alreadyHasCountedProductsAmount = productsFilteres.find((filteredProduct => filteredProduct._id === product._id))
      const registeredProduct = products.find(stockProduct => stockProduct._id === product._id)
      
      if(!alreadyHasCountedProductsAmount && registeredProduct){
        filteredProductsById.forEach(filteredProduct => {
          productTotalAmount += filteredProduct.amount
        })

        productsFilteres.push({
          _id: product._id,
          name: product.name,
          totalAmount: productTotalAmount,
          commandsAppears: commandsItemsAppears,
          totalPrice: Math.round((productTotalAmount * registeredProduct.unitPrice) * 100) / 100
        })
      }

    })

    productsFilteres?.sort((a, b) => b.totalAmount - a.totalAmount)
  }

  verifyProductsQuantity()

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
                  Itens do dia:{' '}
                  <BoldText>{dt.toLocaleString(DateTime.DATE_FULL)}</BoldText>
                </>
              ) : (
                <>
                  Itens de:{' '}
                  <BoldText>{cashier.month} de {cashier.year}</BoldText>
                </>
              )}
              
            </Heading>
            <Box bg="blue.400" p={1} px={[2, 4]} rounded={4}>
              <Text fontSize={[20, 22]} color="blue.50">
                Total de itens vendidos:{' '}
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
            {productsFilteres.map((product) => (
               <Tr key={`sold-items-oflist-${product._id}`}>
                <Td>{product.name}</Td>
                <Td>{Math.round(product.totalAmount * 100) / 100}</Td>
                <Td>{parseToBRL(product.totalPrice)}</Td>
                <Td>{product.commandsAppears}</Td>
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