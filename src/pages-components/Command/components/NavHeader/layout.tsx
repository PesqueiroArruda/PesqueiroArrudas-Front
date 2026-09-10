import { Dispatch, SetStateAction } from 'react';
import { ArrowUpDown, Filter, ListPlus } from 'lucide-react';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { cn } from 'lib/utils';

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

const sortOptions = [
  { text: 'Nome', prop: 'name' },
  { text: 'Quantidade', prop: 'amount' },
  { text: 'Preço Unid', prop: 'unitPrice' },
];

interface Props {
  // eslint-disable-next-line no-unused-vars
  handleChangeFilter: (newFilter: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeOrderBy: (newOrderBy: string) => void;
  filter: string;
  orderBy: string;
  searchContent: string;
  setSearchContent: Dispatch<SetStateAction<string>>;
  handleOpenAddProductModal: () => void;
}

const triggerClassName =
  'flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-input bg-card px-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary';

export const NavHeaderLayout = ({
  handleChangeFilter,
  handleChangeOrderBy,
  filter,
  orderBy,
  searchContent,
  setSearchContent,
  handleOpenAddProductModal,
}: Props) => {
  const isFilterItemSelected = (filterText: string) =>
    filterText.replace(' ', '').toLowerCase() === filter.replace(' ', '').toLowerCase();

  const isOrderByItemSelected = (orderByText: string) => orderByText.toLowerCase() === orderBy.toLowerCase();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-nowrap">
        <div className="lg:w-50 lg:flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassName}>
              <Filter className="h-4 w-4" />
              Filtrar por
              {filter && <Dot />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-70 w-50 overflow-y-auto">
              {filterOptions.map((filterText) => (
                <DropdownMenuItem
                  key={`command-filter-${filterText}`}
                  onSelect={() => handleChangeFilter(filterText)}
                  className={cn(
                    isFilterItemSelected(filterText) && 'bg-primary text-primary-foreground focus:bg-primary',
                  )}
                >
                  {filterText}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:w-50 lg:flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassName}>
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por
              {orderBy && <Dot />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-50">
              {sortOptions.map(({ text, prop }) => (
                <DropdownMenuItem
                  key={`command-sort-${prop}`}
                  onSelect={() => handleChangeOrderBy(prop)}
                  className={cn(isOrderByItemSelected(prop) && 'bg-primary text-primary-foreground focus:bg-primary')}
                >
                  {text}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <input
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
          placeholder="Encontrar produto..."
          className="col-span-2 h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex-1"
        />

        <Button onClick={handleOpenAddProductModal} className="col-span-2 lg:col-span-1">
          Adicionar Produto
          <ListPlus className="h-4 w-4" />
        </Button>
      </div>

      {filter && (
        <p className="text-sm text-text-muted">
          Filtrando por: <span className="font-bold text-navy">{filter}</span>
        </p>
      )}
    </div>
  );
};

const Dot = () => <span className="h-2 w-2 rounded-full bg-gold" />;
