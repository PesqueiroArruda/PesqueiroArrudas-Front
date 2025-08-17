import {
  Stack,
  Button,
  Text,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  Icon,
  MenuItem,
  MenuList,
  Flex,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { CgOptions } from 'react-icons/cg';
import { BsPatchCheck, BsPatchCheckFill, BsSnow } from 'react-icons/bs';

import { OrderProduct } from 'types/OrderProduct';
import { DateTime } from 'luxon';
import { Order } from '../../../../types/Order';
import { RxDragHandleDots2 } from 'react-icons/rx';

const productColumns = [
  {
    text: 'Quantidade',
    prop: 'amount',
  },
  {
    text: 'Nome',
    prop: 'name',
  },
  { text: '', prop: '*' },
];

interface Props {
  order: Order;
  handleCheckOneProduct: (product: OrderProduct) => void;
  handleDefrostOneProduct: (product: OrderProduct) => void;
  handleOpenCheckOrderModal: (orderToCheck: Order) => void;
  listeners: any;
  isDragging: boolean;
}

export const OrderLayout = ({
  order,
  handleCheckOneProduct,
  handleDefrostOneProduct,
  handleOpenCheckOrderModal,
  listeners,
  isDragging
}: Props) => {
  const dt = DateTime.fromISO(order?.createdAt as string, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');

  const createdAtFormatted = dt.toLocaleString(DateTime.TIME_24_SIMPLE);

  return (
    <Stack
      bg="blue.50"
      p={[2, 4]}
      rounded={[2, 4]}
      mt={[4, 6]}
      border="1px solid"
      borderColor="gray.300"
      gap={[1, 2]}
    >
      <Flex justifyContent="space-between" align="center">
        <Text color="blue.800" fontSize={[18, 20]} fontWeight={600}>
          Mesa:{' '}
          <Box as="span" display="inline-block" fontWeight={700}>
            {order?.table}
          </Box>
        </Text>
        <Text color="blue.800" fontSize={[18, 20]} fontWeight={600}>
          Pedido por:{' '}
          <Box as="span" display="inline-block" fontWeight={700}>
            {order?.orderWaiter}
          </Box>
        </Text>
        <Text>
          Criado:{' '}
          <Box as="span" fontWeight={600}>
            {createdAtFormatted}
          </Box>
        </Text>
        <IconButton
          aria-label="Arrastar para reordenar"
          icon={<RxDragHandleDots2 />}
          size="sm"
          variant="ghost"
          // listeners APENAS no handle
          {...listeners}
          // UX
          cursor={isDragging ? 'grabbing' : 'grab'}
          // evita que o handle capture o foco do teclado o tempo todo
          tabIndex={0}
        />
      </Flex>
      {order.observation && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center'
        }}>
          <text style={{
            background: 'red',
            color: 'white',
            padding: 6
          }}>
            {order.observation}
          </text>
        </div>
      )}
      <TableContainer
        bg="whiteAlpha.700"
        // bg="blue.50"
        color="blue.900"
        py={[2, 3]}
        rounded={4}
        boxShadow="sm"
        overflow="visible"
        pb="42px !important"
      >
        <Table size="md" textAlign="left">
          <Thead>
            <Tr>
              {productColumns.map((column) => (
                <Th
                  key={`kitchen-order-product-column-${column.prop}`}
                  color="blue.900"
                >
                  {column.text}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {order.products.map(({ _id, name, amount, isMade, isThawed }) => (
              <Tr key={`${order._id}${_id}`}>
                <Td w="40%">{amount}</Td>
                <Td w="50%">{name}</Td>

                <Td isNumeric>
                  <Flex align="center" justify="flex-end" gap={2}>
                    {isMade && (
                      <Flex bg="green.300" gap={2} px={2} py={1} rounded={3}>
                        <Icon as={BsPatchCheckFill} color="white" mt={0.5} fontSize={[16, 18]} />
                        <Text fontWeight={600} color="white">Feito</Text>
                      </Flex>
                    )}

                    {isThawed && (
                      <Flex bg="blue.300" gap={2} px={2} py={1} rounded={3}>
                        <Icon as={BsSnow} color="white" mt={0.5} fontSize={[16, 18]} />
                        <Text fontWeight={600} color="white">Descongelado</Text>
                      </Flex>
                    )}

                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Opções"
                        icon={<CgOptions />}
                        variant="ghost"
                        size="sm"
                        color="blue.800"
                      />
                      <MenuList p={1.5}>
                        <MenuItem
                          onClick={() =>
                            handleCheckOneProduct({ _id, name, amount, isMade, isThawed })
                          }
                          icon={<BsPatchCheck fontSize={17} />}
                          fontWeight="600"
                          rounded={4}
                        >
                          Marcar item como feito
                        </MenuItem>

                        <MenuItem
                          onClick={() =>
                            handleDefrostOneProduct({ _id, name, amount, isMade, isThawed })
                          }
                          icon={<BsSnow fontSize={17} />}
                          fontWeight="600"
                          rounded={4}
                        >
                          Marcar item como descongelado
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button
        onClick={() => handleOpenCheckOrderModal(order)}
        colorScheme="blue"
      >
        Baixar pedido
      </Button>
    </Stack>
  );
};
