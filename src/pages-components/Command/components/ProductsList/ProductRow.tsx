import { Dispatch, memo, RefObject, SetStateAction } from 'react';
import { MinusCircle, MoreVertical, PlusCircle, Trash2, Wallet } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Input } from 'components/ui/input';
import { TableCell, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { Product } from 'types/Product';
import { formatAmount } from 'utils/formatAmount';
import { parseToBRL } from 'utils/parseToBRL';

function isFishingCategory(category?: string) {
  return category?.toLowerCase() === 'peixes' || category?.toLowerCase() === 'misturas congeladas';
}

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

type Props = {
  _id: string;
  name: string;
  amount: number;
  unitPrice: number;
  category?: string;
  totalPayed?: number;
  commandIsPayed: boolean;
  isAdmin: boolean;
  isEditingAmount: boolean;
  editAmountInputRef: RefObject<HTMLInputElement>;
  newProductAmount: string;
  setNewProductAmount: Dispatch<SetStateAction<string>>;
  handleActiveEditFishAmount: ({ productId, amount }: ActiveEditFish) => void;
  handleUpdateProductAmount: any;
  handleOpenPayProductModal: (product: Product) => void;
  handleOpenDeleteModal: ({ productId }: { productId: string }) => void;
  handleDecrementProductAmount: (product: AmountProduct) => void;
  handleIncrementProductAmount: ({ productId, amount }: { productId: string; amount: number }) => void;
};

export const ProductRow = memo(
  ({
    _id,
    name,
    amount,
    unitPrice,
    category,
    totalPayed,
    commandIsPayed,
    isAdmin,
    isEditingAmount,
    editAmountInputRef,
    newProductAmount,
    setNewProductAmount,
    handleActiveEditFishAmount,
    handleUpdateProductAmount,
    handleOpenPayProductModal,
    handleOpenDeleteModal,
    handleDecrementProductAmount,
    handleIncrementProductAmount,
  }: Props) => (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {isEditingAmount ? (
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
                      } as Product)
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
  )
);

ProductRow.displayName = 'ProductRow';
