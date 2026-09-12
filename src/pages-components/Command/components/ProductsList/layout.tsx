import { Dispatch, SetStateAction, useContext } from 'react';
import { ArrowUp, Frown } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { CommandContext } from 'pages-components/Command';
import { Product } from 'types/Product';
import { useClickOutsideToClose } from 'hooks/useClickOutsideToClose';
import { ProductRow } from './ProductRow';

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
            products.map((product: Product) => (
              <ProductRow
                key={`product-list-${product._id}`}
                {...product}
                commandIsPayed={commandIsPayed}
                isAdmin={isAdmin}
                isEditingAmount={fishIdToEditAmount === product._id}
                editAmountInputRef={editAmountInputRef}
                newProductAmount={newProductAmount}
                setNewProductAmount={setNewProductAmount}
                handleActiveEditFishAmount={handleActiveEditFishAmount}
                handleUpdateProductAmount={handleUpdateProductAmount}
                handleOpenPayProductModal={handleOpenPayProductModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
                handleDecrementProductAmount={handleDecrementProductAmount}
                handleIncrementProductAmount={handleIncrementProductAmount}
              />
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
