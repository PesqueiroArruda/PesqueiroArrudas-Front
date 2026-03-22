/* eslint-disable react/no-children-prop */
import { Dispatch, SetStateAction } from 'react';
import {
  InputGroup,
  InputLeftElement,
  Stack,
  Icon,
  Input,
  Grid,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Textarea,
  Checkbox,
  useBreakpointValue
} from '@chakra-ui/react';
import { BiSad, BiSearchAlt } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

import { Modal } from 'components/Modal';
import { formatAmount } from 'utils/formatAmount';
import { parseToBRL } from 'utils/parseToBRL';

const filterOptions = [
  'Pesca',
  'Peixes',
  'Pratos',
  'Bebidas',
  'Doses',
  'Sobremesas',
  'Porções',
  'Misturas Congeladas',
];

const productsColumns = ['Nome', 'Quantidade', 'Preço Unid.'];

interface ProductNoAmount {
  _id?: string;
  name: string;
  unitPrice: number;
  category: string;
}

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  products: any[];
  selectedProducts: any[];
  handleOpenAmountModal: ({ product }: { product: ProductNoAmount }) => void;
  handleRemoveSelectedProduct: ({ id }: { id: string }) => void;
  handleAddProductsInCommand: () => void;
  filter: string;
  observation: string;
  searchContent: string;
  setSearchContent: Dispatch<SetStateAction<string>>;
  handleChangeFilter: (selectedFilter: string) => void;
  isAddingProducts: boolean;
  handleFavoriteProduct: (_id: string) => void;
  handleUnfavoriteProduct: (_id: string) => void;
  setObservation: (value: string) => void;
  setSendToKitchen: (value: boolean) => void;
  sendToKitchen: boolean;
}

export const AddProductModalLayout = ({
  isModalOpen,
  handleCloseModal,
  products,
  selectedProducts,
  handleOpenAmountModal,
  handleRemoveSelectedProduct,
  handleAddProductsInCommand,
  filter,
  handleChangeFilter,
  searchContent,
  setSearchContent,
  isAddingProducts,
  handleFavoriteProduct,
  handleUnfavoriteProduct,
  setObservation,
  observation,
  setSendToKitchen,
  sendToKitchen
}: Props) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => handleCloseModal()}
      title="Adicionar Produto"
      size="full"
      modalBodyOverflow="hidden"
    >
      <Stack spacing={[4, 6]} overflowY="auto">
        <Grid templateColumns={['1fr', '1fr 3fr']} gap={[2, 4]}>
          <Menu>
            <MenuButton
              bg="blue.50"
              color="blue.800"
              _active={{
                bg: 'blue.300',
                color: 'white',
              }}
              as={Button}
            >
              <Flex align="center" justify="center" gap={[1, 3]}>
                Filtrar
                {filter && <Square />}
              </Flex>
            </MenuButton>
            <MenuList overflow="auto" bg="blue.50" p={2} maxH="280px">
              {filterOptions.map((filterText) => (
                <MenuItem
                  key={`add-product-filter-${filterText}`}
                  onClick={() => handleChangeFilter(filterText)}
                  bg={filter === filterText ? 'blue.300' : 'none'}
                  color={filter === filterText ? 'white' : 'blue.800'}
                  rounded={4}
                  _focus={{
                    bg: 'blue.100',
                  }}
                >
                  {filterText}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={BiSearchAlt} />
            </InputLeftElement>
            <Input
              placeholder="Pesquise por algum produto"
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
            />
          </InputGroup>
        </Grid>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={3}
          align={{ base: 'stretch', md: 'center' }}
        >
          <Checkbox
            onChange={(e) => setSendToKitchen(e.target.checked)}
            isChecked={sendToKitchen}
            alignSelf={{ base: 'flex-start', md: 'center' }}
          >
            Enviar para cozinha
          </Checkbox>

          <Textarea
            placeholder="Ex: Coca Cola com gelo e limão"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            disabled={!sendToKitchen}
            size="sm"
            minH={{ base: '90px', md: 'auto' }}
          />
        </Flex>

        {isMobile ? (
  <div
    style={{
      width: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
      paddingBottom: '8px',
      minHeight: '96px',
      WebkitOverflowScrolling: 'touch',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '8px',
      boxSizing: 'border-box',
    }}
  >
    {selectedProducts?.map((product, index) => (
      <div
        key={product?._id || index}
        style={{
          display: 'inline-flex',
          verticalAlign: 'top',
          width: '260px',
          minHeight: '78px',
          marginRight: '12px',
          background: '#F3F4F6',
          borderRadius: '8px',
          padding: '12px',
          color: '#1E3A8A',
          boxSizing: 'border-box',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ minWidth: 0, whiteSpace: 'normal', flex: 1 }}>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {product?.name || 'Sem nome'} {' | '} Qntd:{' '}
            {formatAmount({ num: product?.amount || 0, to: 'comma' })}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            product?._id && handleRemoveSelectedProduct({ id: product._id })
          }
          style={{
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            color: 'inherit',
          }}
          aria-label={`Remover produto ${product?.name || ''}`}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
) : (
  <Grid
    templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }}
    gap={[2, 4]}
  >
    {selectedProducts.map(({ _id, name, amount }) => (
      <Flex
        key={`selected-product-${_id}`}
        align="center"
        justify="space-between"
        bg="gray.100"
        p={3}
        rounded="md"
        color="blue.700"
        gap={3}
      >
        <Flex direction="column" minW={0}>
          <Text fontSize={14} fontWeight={600} noOfLines={2}>
            {name}
          </Text>
          <Text fontSize={13} fontWeight={500}>
            Qntd: {formatAmount({ num: amount, to: 'comma' })}
          </Text>
        </Flex>

        <Icon
          as={IoClose}
          onClick={() => handleRemoveSelectedProduct({ id: _id })}
          cursor="pointer"
          fontSize={[18, 20]}
          flexShrink={0}
          _hover={{
            bg: 'blue.100',
            rounded: 3,
          }}
          _active={{
            bg: 'blue.200',
          }}
        />
      </Flex>
    ))}
  </Grid>
)}

        {isMobile ? (
          <Box
    maxH="45vh"
    overflowY="auto"
    pr={1}
  >
    <Stack spacing={3}>
      {products?.length > 0 &&
        products.map(({ _id, name, unitPrice, amount, category, isFavorite }) => (
          <Box
            key={`add-product-mobile-${_id}`}
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
            p={3}
            bg="white"
          >
            <Flex justify="space-between" align="flex-start" gap={3}>
              <Box minW={0}>
                <Text fontWeight={700} color="blue.700" noOfLines={2}>
                  {name}
                </Text>

                <Text fontSize="sm" color="gray.600">
                  Quantidade: {amount}
                </Text>

                <Text fontSize="sm" color="gray.600">
                  Preço: {parseToBRL(unitPrice || 0)}
                </Text>
              </Box>

              {isFavorite ? (
                <Icon
                  onClick={() => handleUnfavoriteProduct(_id)}
                  as={AiFillStar}
                  fontSize={22}
                  color="blue.600"
                  cursor="pointer"
                />
              ) : (
                <Icon
                  onClick={() => handleFavoriteProduct(_id)}
                  as={AiOutlineStar}
                  fontSize={22}
                  color="blue.600"
                  cursor="pointer"
                />
              )}
            </Flex>

            <Button
              mt={3}
              w="100%"
              bg="blue.50"
              color="blue.700"
              onClick={() =>
                handleOpenAmountModal({
                  product: { _id, name, unitPrice, category },
                })
              }
            >
              Selecionar
            </Button>
          </Box>
        ))}
    </Stack>
  </Box>
        ) : (
          <TableContainer overflowY="auto">
            <Table w="100%" mt={[2, 4]} size="sm">
              <Thead>
                <Tr>
                  {productsColumns.map((column) => (
                    <Th key={`add-product-table-header-${column}`}>{column}</Th>
                  ))}
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {products?.length > 0 &&
                  products.map(
                    ({ _id, name, unitPrice, amount, category, isFavorite }) => (
                      <Tr key={`add-product-modal-product-${_id}`}>
                        <Td>{name}</Td>
                        <Td>{amount}</Td>
                        <Td>{parseToBRL(unitPrice || 0)}</Td>
                        <Td isNumeric>
                          <Flex justify="flex-end" align="center" gap={2}>
                            <Button
                              bg="blue.50"
                              color="blue.700"
                              onClick={() =>
                                handleOpenAmountModal({
                                  product: { _id, name, unitPrice, category },
                                })
                              }
                            >
                              Selecionar
                            </Button>

                            {isFavorite ? (
                              <Icon
                                onClick={() => handleUnfavoriteProduct(_id)}
                                as={AiFillStar}
                                fontSize={[18, 20]}
                                color="blue.600"
                                cursor="pointer"
                              />
                            ) : (
                              <Icon
                                onClick={() => handleFavoriteProduct(_id)}
                                as={AiOutlineStar}
                                fontSize={[18, 20]}
                                color="blue.600"
                                cursor="pointer"
                              />
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    )
                  )}

                {products?.length === 0 && (
                  <Tr>
                    <Td>
                      <Flex align="center" gap={4} mt={4} color="blue.700">
                        <Icon as={BiSad} fontSize={32} />
                        <Text fontSize={20} fontWeight={600}>
                          Nenhum Produto com essa categoria
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
          <Button onClick={() => handleCloseModal()} w="100%">
            Cancelar
          </Button>
          <Button
            onClick={() => handleAddProductsInCommand()}
            colorScheme="blue"
            isLoading={isAddingProducts}
            loadingText="Adicionando Produtos"
            w="100%"
          >
            Adicionar Produtos
          </Button>
        </Grid>
      </Stack>
    </Modal>
  );
};

const Square = () => (
  <Box
    w={[1, 1, 2]}
    h={[1, 1, 2]}
    mt={[0, 0, 1]}
    ml={[0, 0, 1]}
    rounded={2}
    bg="blue.200"
  />
);