/* eslint-disable react/jsx-no-useless-fragment */
import { motion } from 'framer-motion';
import {
  Flex,
  TableContainer,
  Table,
  Th,
  Thead,
  Tr,
  Td,
  Tbody,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FaArrowUp, FaGlassWhiskey } from 'react-icons/fa';
import { AiFillStar, AiOutlineStar, AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { PiForkKnife, PiBowlFood } from "react-icons/pi";
import { TbBottle } from "react-icons/tb";
import { BiDrink } from "react-icons/bi";
import { GiFishingHook, GiFishing, GiChocolateBar, GiIceCube } from "react-icons/gi";

import { Product } from 'pages-components/Stock/types/Product';
import { parseToBRL } from 'utils/parseToBRL';

const stockColumns = [
  { text: '', prop: 'image' },
  { text: 'Nome', prop: 'name' },
  { text: 'Categoria', prop: 'category' },
  { text: 'Qntd', prop: 'amount' },
  { text: 'Preço unid.', prop: 'unitPrice' },
];

type LayoutProps = {
  isLoading: boolean;
  handleOpenEditModal: any;
  handleToggleOrderByDir: any;
  handleOpenDeleteItemModal: any;
  orderByDir: 'asc' | 'desc';
  orderBy: string;
  items: Product[];
  handleFavoriteProduct: (_id: string) => void;
  handleUnfavoriteProduct: (_id: string) => void;
};

export const ItemsTableLayout = ({
  isLoading,
  orderByDir,
  handleToggleOrderByDir,
  handleOpenEditModal,
  handleOpenDeleteItemModal,
  orderBy,
  items,
  handleFavoriteProduct,
  handleUnfavoriteProduct,
}: LayoutProps) => {
  function isColumnSelectedToOrder(column: string) {
    return column.toLocaleLowerCase() === orderBy.toLocaleLowerCase();
  }

  return (
    <>
      {isLoading ? (
        <Spinner 
          size="xl" 
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                {stockColumns.map(({ text, prop }) => (
                  <Th key={`header-${prop}`}>
                    <Flex align="center" gap={2}>
                      {text}{' '}
                      {isColumnSelectedToOrder(prop) === true && (
                        <motion.div
                          style={{
                            transform:
                              orderByDir === 'asc'
                                ? 'rotate(0deg)'
                                : 'rotate(180deg)',
                          }}
                        >
                          <Icon
                            as={FaArrowUp}
                            fontSize={16}
                            color="blue.800"
                            onClick={() => handleToggleOrderByDir()}
                            cursor="pointer"
                          />
                        </motion.div>
                      )}
                    </Flex>
                  </Th>
                ))}
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {items.map(
                ({
                  _id,
                  imageURL,
                  amount,
                  category,
                  unitPrice,
                  name,
                  isFavorite,
                }) => (
                  <Tr
                    key={`stock-product-_id${_id}`}
                    cursor="pointer"
                    _hover={{
                      bg: 'blue.50',
                    }}
                  >
                    <Td>
                      {category === "Bebidas" && (
                        <TbBottle size={28} color='blue'/>
                      )}
                      {category === "Pratos" && (
                        <PiForkKnife size={28} color='orange'/>
                      )}
                      {category === "Porções" && (
                        <PiBowlFood size={28} color='yellow'/>
                      )}
                      {category === "Bebidas-Cozinha" && (
                        <BiDrink size={28} color='purple'/>
                      )}
                      {category === "Pesca" && (
                        <GiFishingHook size={28} color='gray'/>
                      )}
                      {category === "Peixes" && (
                        <GiFishing size={28} color="lightblue"/>
                      )}
                      {category === "Sobremesas" && (
                        <GiChocolateBar size={28} color="brown"/>
                      )}
                      {category === "Doses" && (
                        <FaGlassWhiskey size={28} color="red"/>
                      )}
                      {category === "Misturas Congeladas" && (
                        <GiIceCube size={28} color="lightblue"/>
                      )}
                    </Td>
                    <Td>{name}</Td>
                    <Td>{category}</Td>
                    <Td>{amount}</Td>
                    <Td>{parseToBRL(unitPrice || 0)}</Td>
                    <Td>
                      {/* <Button></Button> */}
                      <Flex gap={2} align="center" color="blue.800">
                        <Icon
                          onClick={() =>
                            handleOpenEditModal({
                              name,
                              image: imageURL,
                              id: _id,
                              amount,
                              unitPrice,
                              category,
                            })
                          }
                          as={FiEdit2}
                          fontSize={[16, 18]}
                          _hover={{ color: 'blue.500' }}
                        />
                        <Icon
                          onClick={() =>
                            handleOpenDeleteItemModal({ itemId: _id })
                          }
                          as={AiOutlineDelete}
                          fontSize={[20, 22]}
                          _hover={{ color: 'red.400' }}
                        />
                        {isFavorite ? (
                          <Icon
                            onClick={() =>
                              handleUnfavoriteProduct((_id as string) || '')
                            }
                            as={AiFillStar}
                            fontSize={[18, 20]}
                            color="blue.600"
                            cursor="pointer"
                            _hover={{
                              color: 'blue.700',
                            }}
                          />
                        ) : (
                          <Icon
                            onClick={() =>
                              handleFavoriteProduct((_id as string) || '')
                            }
                            as={AiOutlineStar}
                            fontSize={[18, 20]}
                            color="blue.600"
                            cursor="pointer"
                            _hover={{
                              color: 'blue.700',
                            }}
                          />
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
