import { Dispatch, SetStateAction } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { cn } from 'lib/utils';

const filterOptions = ['Pesca Esportiva', 'Pesque Pague'];
const sortOptions = [
  { text: 'Mesa', prop: 'table' },
  { text: 'Garçom', prop: 'waiter' },
  { text: 'Total', prop: 'total' },
];

type Props = {
  // eslint-disable-next-line no-unused-vars
  handleChangeFilter: (newFilter: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeOrderBy: (newOrderBy: string) => void;
  filter: string;
  orderBy: string;
  searchContent: string;
  setSearchContent: Dispatch<SetStateAction<string>>;
};

const triggerClassName =
  'flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-input bg-card px-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary';

export const NavHeaderLayout = ({
  handleChangeFilter,
  handleChangeOrderBy,
  filter,
  orderBy,
  searchContent,
  setSearchContent,
}: Props) => {
  const isFilterItemSelected = (filterText: string) =>
    filterText.replace(' ', '').toLowerCase() === filter.replace(' ', '').toLowerCase();

  const isOrderByItemSelected = (orderByText: string) => orderByText.toLowerCase() === orderBy.toLowerCase();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-nowrap">
        <div className="sm:w-50 sm:flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassName}>
              <Filter className="h-4 w-4" />
              Filtrar por
              {filter && <Dot />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-50">
              {filterOptions.map((filterText) => (
                <DropdownMenuItem
                  key={`commands-filter-${filterText}`}
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

        <div className="sm:w-50 sm:flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassName}>
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por
              {orderBy && <Dot />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-50">
              {sortOptions.map(({ text, prop }) => (
                <DropdownMenuItem
                  key={`commands-sort-${prop}`}
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
          placeholder="Encontrar comanda..."
          className="col-span-2 h-10 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
        />
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
