import { Dispatch, SetStateAction } from 'react';
import { Frown, Loader2, Search, Star, X } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { cn } from 'lib/utils';
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

const FavoriteToggle = ({ isFavorite, onToggle }: { isFavorite: boolean; onToggle: () => void }) => (
  <Star
    onClick={onToggle}
    className={cn(
      'h-5 w-5 shrink-0 cursor-pointer',
      isFavorite ? 'fill-gold text-gold' : 'text-navy/60 hover:text-gold',
    )}
  />
);

const EmptyState = () => (
  <div className="flex items-center gap-3 py-4 text-navy">
    <Frown className="h-7 w-7" />
    <span className="text-lg font-bold">Nenhum Produto com essa categoria</span>
  </div>
);

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
  sendToKitchen,
}: Props) => (
  <Modal
    isOpen={isModalOpen}
    onClose={() => handleCloseModal()}
    title="Adicionar Produto"
    size="full"
    modalBodyOverflow="hidden"
  >
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      <div className="grid gap-3 sm:grid-cols-[1fr_3fr]">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center justify-center gap-2 rounded-(--radius) border border-input bg-card px-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary">
            Filtrar
            {filter && <span className="h-2 w-2 rounded-full bg-gold" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-70 overflow-y-auto">
            {filterOptions.map((filterText) => (
              <DropdownMenuItem
                key={`add-product-filter-${filterText}`}
                onSelect={() => handleChangeFilter(filterText)}
                className={cn(filter === filterText && 'bg-primary text-primary-foreground focus:bg-primary')}
              >
                {filterText}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative h-10">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Pesquise por algum produto"
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
            className="h-10 w-full rounded-(--radius) border border-input bg-card pl-10 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label
          htmlFor="add-product-send-to-kitchen"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-navy"
        >
          <input
            id="add-product-send-to-kitchen"
            type="checkbox"
            checked={sendToKitchen}
            onChange={(e) => setSendToKitchen(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-gold"
          />
          Enviar para cozinha
        </label>

        <textarea
          placeholder="Ex: Coca Cola com gelo e limão"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          disabled={!sendToKitchen}
          className="min-h-[90px] w-full rounded-(--radius) border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[44px]"
        />
      </div>

      {selectedProducts.length > 0 && (
        <>
          {/* Mobile: horizontal strip */}
          <div className="flex gap-3 overflow-x-auto rounded-(--radius) border border-border p-2 md:hidden">
            {selectedProducts.map(({ _id, name, amount }) => (
              <div
                key={`selected-product-mobile-${_id}`}
                className="flex w-65 shrink-0 items-start justify-between gap-3 rounded-(--radius) bg-secondary p-3 text-navy"
              >
                <p className="text-sm font-bold">
                  {name || 'Sem nome'} | Qntd: {formatAmount({ num: amount || 0, to: 'comma' })}
                </p>
                <button
                  type="button"
                  onClick={() => _id && handleRemoveSelectedProduct({ id: _id })}
                  aria-label={`Remover produto ${name || ''}`}
                  className="shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
            {selectedProducts.map(({ _id, name, amount }) => (
              <div
                key={`selected-product-${_id}`}
                className="flex items-center justify-between gap-3 rounded-(--radius) bg-secondary p-3 text-navy"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-bold">{name}</span>
                  <span className="text-sm text-text-muted">
                    Qntd: {formatAmount({ num: amount, to: 'comma' })}
                  </span>
                </div>
                <X
                  onClick={() => handleRemoveSelectedProduct({ id: _id })}
                  className="h-5 w-5 shrink-0 cursor-pointer rounded-sm hover:bg-border"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile: product cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {products?.map(({ _id, name, unitPrice, amount, category, isFavorite }) => (
          <div key={`add-product-mobile-${_id}`} className="rounded-(--radius) border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-navy">{name}</p>
                <p className="text-sm text-text-muted">Quantidade: {amount}</p>
                <p className="text-sm text-text-muted">Preço: {parseToBRL(unitPrice || 0)}</p>
              </div>
              <FavoriteToggle
                isFavorite={isFavorite}
                onToggle={() => (isFavorite ? handleUnfavoriteProduct(_id) : handleFavoriteProduct(_id))}
              />
            </div>
            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={() => handleOpenAmountModal({ product: { _id, name, unitPrice, category } })}
            >
              Selecionar
            </Button>
          </div>
        ))}
        {products?.length === 0 && <EmptyState />}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {productsColumns.map((column) => (
                <TableHead key={`add-product-table-header-${column}`}>{column}</TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length > 0 ? (
              products.map(({ _id, name, unitPrice, amount, category, isFavorite }) => (
                <TableRow key={`add-product-modal-product-${_id}`}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{parseToBRL(unitPrice || 0)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenAmountModal({ product: { _id, name, unitPrice, category } })}
                      >
                        Selecionar
                      </Button>
                      <FavoriteToggle
                        isFavorite={isFavorite}
                        onToggle={() => (isFavorite ? handleUnfavoriteProduct(_id) : handleFavoriteProduct(_id))}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Button variant="secondary" onClick={() => handleCloseModal()}>
          Cancelar
        </Button>
        <Button onClick={() => handleAddProductsInCommand()} disabled={isAddingProducts}>
          {isAddingProducts && <Loader2 className="h-4 w-4 animate-spin" />}
          {isAddingProducts ? 'Adicionando Produtos' : 'Adicionar Produtos'}
        </Button>
      </div>
    </div>
  </Modal>
);
