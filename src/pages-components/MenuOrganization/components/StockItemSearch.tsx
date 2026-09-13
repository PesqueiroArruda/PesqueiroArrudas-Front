import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import { cn } from 'lib/utils';
import { Input } from 'components/ui/input';
import { Product } from 'pages-components/Stock/types/Product';

interface Props {
  items: Product[];
  selectedProduct: Product | null;
  onSelect: (product: Product | null) => void;
}

const MAX_RESULTS = 30;

// Select nativo com centenas de itens do estoque é inutilizável pra achar um
// item específico — esse combobox filtra pelo nome enquanto digita e limita
// quantos resultados renderiza de uma vez.
export const StockItemSearch = ({
  items,
  selectedProduct,
  onSelect,
}: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = normalizedQuery
      ? items.filter((item) =>
          item.name.toLowerCase().includes(normalizedQuery)
        )
      : items;
    return matches.slice(0, MAX_RESULTS);
  }, [items, query]);

  function handleSelect(product: Product) {
    onSelect(product);
    setQuery('');
    setIsOpen(false);
  }

  function handleClear() {
    onSelect(null);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative">
      {selectedProduct ? (
        <div className="flex h-10 items-center justify-between gap-2 rounded-(--radius) border border-input bg-card px-3">
          <span className="truncate text-sm font-semibold text-navy">
            {selectedProduct.name} ({selectedProduct.category})
          </span>
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar seleção"
            className="flex h-6 w-6 shrink-0 items-center justify-center text-text-muted hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Digite pra buscar um item do estoque..."
            className="pl-9"
          />
        </div>
      )}

      {isOpen && !selectedProduct && (
        <div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-(--radius) border border-border bg-card shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-text-muted">
              Nenhum item encontrado.
            </p>
          ) : (
            <>
              {results.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-secondary'
                  )}
                >
                  <span className="font-semibold text-navy">{item.name}</span>
                  <span className="text-xs text-text-muted">
                    {item.category}
                  </span>
                </button>
              ))}
              {items.length > MAX_RESULTS && results.length === MAX_RESULTS && (
                <p className="border-t border-border px-3 py-1.5 text-xs text-text-muted">
                  Mostrando os primeiros {MAX_RESULTS} — refine a busca pra
                  achar outros.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
