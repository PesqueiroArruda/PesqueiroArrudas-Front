import { Dispatch, SetStateAction, useContext } from 'react';
import { ArrowUp, Frown, MinusCircle, MoreVertical, PlusCircle, Trash2, Wallet } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Input } from 'components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { CommandContext } from 'pages-components/Command';
import { Product } from 'types/Product';
import { formatAmount } from 'utils/formatAmount';
import { parseToBRL } from 'utils/parseToBRL';
import { useClickOutsideToClose } from 'hooks/useClickOutsideToClose';

const columns = [
  { text: 'Nome', prop: 'name' },
  { text: 'Quantidade', prop: 'amount' },
  { text: 'Preço Unid', prop: 'unitPrice' },
  { text: 'Total', prop: 'total' },
  { text: 'Pago', prop: 'totalPayed' },
];

interface ActiveEditFish {
  productId: string;
  amount: string;
}

interface AmountProduct {
  _id: string;
  unitPrice: number;
  totalPayed: number;
  amount: number;
}

interface Props {
  products: any[];
  handleOpenDeleteModal: ({ productId }: { productId: string }) => void;
  handleToggleOrderByDir: () => void;
  orderBy: string;
  orderByDir: 'asc' | 'desc';
  fishIdToEditAmount: string;
  handleActiveEditFishAmount: ({ productId, amount }: ActiveEditFish) => void;
  handleUpdateProductAmount: any;
  newProductAmount: string;
  setNewProductAmount: Dispatch<SetStateAction<string>>;
  setFishIdToEditAmount: Dispatch<SetStateAction<string>>;
  handleOpenPayProductModal: (product: Product) => void;
  handleDecrementProductAmount: (product: AmountProduct) => void;
  handleIncrementProductAmount: ({ productId, amount }: { productId: string; amount: number }) => void;
  isAdmin: boolean;
}

export const ProductsListLayout = ({
  products,
  handleOpenDeleteModal,
  orderBy,
  orderByDir,
  handleToggleOrderByDir,
  handleActiveEditFishAmount,
  fishIdToEditAmount,
  handleUpdateProductAmount,
  newProductAmount,
  setNewProductAmount,
  setFishIdToEditAmount,
  handleOpenPayProductModal,
  handleIncrementProductAmount,
  handleDecrementProductAmount,
  isAdmin,
}: Props) => {
  const { command } = useContext(CommandContext);
  const commandIsPayed = command?.isActive === false;

  const isFishingCategory = (category?: string) =>
    category?.toLowerCase() === 'peixes' || category?.toLowerCase() === 'misturas congeladas';

  const editAmountInputRef = useClickOutsideToClose(() => {
    setFishIdToEditAmount('');
  });

  const visibleColumns = columns.slice(0, commandIsPayed ? 4 : 5);

  return (
    <div id="commandProducts">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map(({ text, prop }) => (
              <TableHead key={`products-list-header${prop}`}>
                <div className="flex items-center gap-2">
                  {text}
                  {orderBy.toLowerCase() === prop.toLowerCase() && (
                    <ArrowUp
                      onClick={handleToggleOrderByDir}
                      className={cn(
                        'h-4 w-4 cursor-pointer text-navy transition-transform',
                        orderByDir === 'desc' && 'rotate-180',
                      )}
                    />
                  )}
                </div>
              </TableHead>
            ))}
            {isAdmin && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.length > 0 ? (
            products.map(({ _id, name, amount, unitPrice, category, totalPayed }: Product) => (
              <TableRow key={`product-list${name}`}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {fishIdToEditAmount === _id ? (
                      <form
                        onSubmit={(e) =>
                          handleUpdateProductAmount(e, {
                            productId: _id,
                            isFish: isFishingCategory(category),
                          })
                        }
                      >
                        <Input
                          value={newProductAmount}
                          onChange={(e) => setNewProductAmount(e.target.value)}
                          ref={editAmountInputRef}
                          autoFocus
                          className="w-28"
                        />
                      </form>
                    ) : (
                      <>
                        {!commandIsPayed && !isFishingCategory(category) && (
                          <MinusCircle
                            onClick={() => {
                              if (isAdmin) {
                                handleDecrementProductAmount({
                                  _id,
                                  amount,
                                  unitPrice,
                                  totalPayed: Number(totalPayed) as number,
                                });
                              }
                            }}
                            className="h-5 w-5 cursor-pointer text-navy hover:text-cyan"
                          />
                        )}
                        <button
                          type="button"
                          disabled={commandIsPayed}
                          onClick={() =>
                            handleActiveEditFishAmount({
                              productId: _id,
                              amount: amount.toString(),
                            })
                          }
                          className={cn('text-left', !commandIsPayed && 'cursor-pointer')}
                        >
                          {isFishingCategory(category)
                            ? `${formatAmount({ num: amount.toString(), to: 'comma' })} Kg`
                            : amount}
                        </button>
                        {!commandIsPayed && !isFishingCategory(category) && (
                          <PlusCircle
                            onClick={() => handleIncrementProductAmount({ productId: _id, amount })}
                            className="h-5 w-5 cursor-pointer text-navy hover:text-cyan"
                          />
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{parseToBRL(unitPrice || 0)}</TableCell>
                <TableCell>{parseToBRL(Number((amount * unitPrice).toFixed(2)))}</TableCell>
                {!commandIsPayed && <TableCell>{parseToBRL(totalPayed || 0)}</TableCell>}

                {isAdmin && (
                  <TableCell>
                    {!commandIsPayed && (
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded-(--radius) p-1 text-navy hover:bg-secondary">
                            <MoreVertical className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                handleOpenPayProductModal({
                                  _id,
                                  name,
                                  amount,
                                  unitPrice,
                                  category,
                                  totalPayed,
                                })
                              }
                            >
                              <Wallet className="h-4 w-4" />
                              Pagar Produto
                            </DropdownMenuItem>
                            <DropdownMenuItem destructive onSelect={() => handleOpenDeleteModal({ productId: _id })}>
                              <Trash2 className="h-4 w-4" />
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + (isAdmin ? 1 : 0)}>
                <div className="flex items-center gap-3 py-4 text-navy">
                  <Frown className="h-7 w-7" />
                  <span className="text-lg font-bold">Nenhum produto encontrado</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
