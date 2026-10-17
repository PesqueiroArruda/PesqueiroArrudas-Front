import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import { cn } from 'lib/utils';
import { Product } from 'types/Product';
import { filterProductsBySearch } from 'utils/filterProductsBySearch';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  products: Product[];
  value: string | null;
  onChange: (productId: string) => void;
  placeholder?: string;
}

// Campo de busca no mesmo estilo da busca do estoque: o campo fica sempre
// visível, mostra o produto escolhido e, ao digitar, lista os resultados.
export const ProductCombobox = ({
  products,
  value,
  onChange,
  placeholder = 'Pesquise por um produto',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedProduct = products.find((product) => product._id === value);
  const filtered = useMemo(
    () => filterProductsBySearch(products, search),
    [products, search]
  );

  function close() {
    setIsOpen(false);
    setSearch('');
  }

  function select(productId: string) {
    onChange(productId);
    close();
    inputRef.current?.blur();
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-highlighted="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [highlighted, isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (isOpen && filtered[highlighted]) select(filtered[highlighted]._id);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        ref={inputRef}
        value={isOpen ? search : selectedProduct?.name ?? ''}
        onChange={(e) => {
          setSearch(e.target.value);
          setHighlighted(0);
          setIsOpen(true);
        }}
        onFocus={(e) => {
          setIsOpen(true);
          setHighlighted(0);
          e.target.select();
        }}
        onKeyDown={handleKeyDown}
        placeholder={selectedProduct ? selectedProduct.name : placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        className={cn(
          'h-10 w-full rounded-(--radius) border border-input bg-card pl-10 text-sm font-semibold text-foreground placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          selectedProduct ? 'pr-9' : 'pr-3'
        )}
      />
      {selectedProduct && (
        <button
          type="button"
          aria-label="Tirar vínculo com o produto"
          onClick={() => select('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 min-w-64 overflow-y-auto rounded-(--radius) border border-border bg-card py-1 shadow-lg"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-3 text-sm text-text-muted">
              Nenhum produto encontrado.
            </li>
          )}
          {filtered.map((product, index) => (
            <li key={product._id}>
              <button
                type="button"
                role="option"
                aria-selected={product._id === value}
                data-highlighted={index === highlighted}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => select(product._id)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-foreground',
                  index === highlighted && 'bg-muted',
                  product._id === value && 'font-bold'
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {product.name}
                  </span>
                  {product.category && (
                    <span className="block truncate text-xs text-text-muted">
                      {product.category}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs font-semibold text-text-muted">
                  {parseToBRL(product.unitPrice)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
