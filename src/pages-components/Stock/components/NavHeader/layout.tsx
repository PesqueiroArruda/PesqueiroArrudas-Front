import { Filter, Search, ArrowUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { cn } from 'lib/utils';

const sortOptions = [
  { text: 'Nome', prop: 'name' },
  { text: 'Categoria', prop: 'category' },
  { text: 'Preço unid.', prop: 'unitPrice' },
  { text: 'Qntd', prop: 'amount' },
];

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

type Props = {
  filters: string;
  orderBy: string;
  handleSetFilter: any;
  handleSetOrderBy: any;
  searchContent: string;
  handleSearchItems: any;
};

const triggerClassName =
  'flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-input bg-card px-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary';

export const NavHeaderLayout = ({
  filters,
  orderBy,
  handleSetFilter,
  handleSetOrderBy,
  searchContent,
  handleSearchItems,
}: Props) => (
  <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-nowrap">
    <div className="sm:w-50 sm:flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClassName}>
          <Filter className="h-4 w-4" />
          Filtrar
          {filters.length > 0 && <Dot />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-50">
          {filterOptions.map((text) => (
            <DropdownMenuItem
              key={`filter-${text}`}
              onSelect={() => handleSetFilter(text)}
              className={cn(text === filters && 'bg-primary text-primary-foreground focus:bg-primary')}
            >
              {text}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="sm:w-50 sm:flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClassName}>
          <ArrowUpDown className="h-4 w-4" />
          Ordenar
          {orderBy && <Dot />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-50">
          {sortOptions.map(({ text, prop }) => (
            <DropdownMenuItem
              key={`sort#${prop}`}
              onSelect={() => handleSetOrderBy(prop)}
              className={cn(prop === orderBy && 'bg-primary text-primary-foreground focus:bg-primary')}
            >
              {text}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="relative col-span-2 h-10 sm:flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        value={searchContent}
        onChange={(e) => handleSearchItems(e)}
        placeholder="Pesquise por um item"
        className="h-10 w-full rounded-(--radius) border border-input bg-card pl-10 pr-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  </div>
);

const Dot = () => <span className="h-2 w-2 rounded-full bg-gold" />;
