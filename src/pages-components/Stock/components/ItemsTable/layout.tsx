import { ReactElement } from 'react';
import { ArrowUp, Loader2, Pencil, Star, Trash2 } from 'lucide-react';
import { FaGlassWhiskey } from 'react-icons/fa';
import { PiForkKnife, PiBowlFood } from 'react-icons/pi';
import { TbBottle } from 'react-icons/tb';
import { BiDrink } from 'react-icons/bi';
import { GiFishingHook, GiFishing, GiChocolateBar, GiIceCube } from 'react-icons/gi';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
import { Product } from 'pages-components/Stock/types/Product';
import { parseToBRL } from 'utils/parseToBRL';

const stockColumns = [
  { text: '', prop: 'image' },
  { text: 'Nome', prop: 'name' },
  { text: 'Categoria', prop: 'category' },
  { text: 'Qntd', prop: 'amount' },
  { text: 'Preço unid.', prop: 'unitPrice' },
];

const categoryIcons: Record<string, ReactElement> = {
  Bebidas: <TbBottle size={22} className="text-cyan" />,
  Pratos: <PiForkKnife size={22} className="text-gold-strong" />,
  Porções: <PiBowlFood size={22} className="text-gold" />,
  'Bebidas-Cozinha': <BiDrink size={22} className="text-cyan" />,
  Pesca: <GiFishingHook size={22} className="text-text-muted" />,
  Peixes: <GiFishing size={22} className="text-cyan" />,
  Sobremesas: <GiChocolateBar size={22} className="text-gold-strong" />,
  Doses: <FaGlassWhiskey size={22} className="text-destructive" />,
  'Misturas Congeladas': <GiIceCube size={22} className="text-cyan" />,
};

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {stockColumns.map(({ text, prop }) => (
            <TableHead key={`header-${prop}`}>
              <div className="flex items-center gap-2">
                {text}
                {isColumnSelectedToOrder(prop) && (
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
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(({ _id, imageURL, amount, category, unitPrice, name, isFavorite, menu }) => (
          <TableRow key={`stock-product-_id${_id}`}>
            <TableCell>{categoryIcons[category]}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{category}</TableCell>
            <TableCell>{amount}</TableCell>
            <TableCell>{parseToBRL(unitPrice || 0)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3 text-navy">
                <Pencil
                  onClick={() =>
                    handleOpenEditModal({
                      name,
                      image: imageURL,
                      id: _id,
                      amount,
                      unitPrice,
                      category,
                      menu,
                    })
                  }
                  className="h-4 w-4 cursor-pointer hover:text-cyan"
                />
                <Trash2
                  onClick={() => handleOpenDeleteItemModal({ itemId: _id })}
                  className="h-5 w-5 cursor-pointer hover:text-destructive"
                />
                {isFavorite ? (
                  <Star
                    onClick={() => handleUnfavoriteProduct((_id as string) || '')}
                    className="h-4.5 w-4.5 cursor-pointer fill-gold text-gold"
                  />
                ) : (
                  <Star
                    onClick={() => handleFavoriteProduct((_id as string) || '')}
                    className="h-4.5 w-4.5 cursor-pointer text-navy/60 hover:text-gold"
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
