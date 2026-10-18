import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { ChevronDown, Loader2, Minus, Plus, Send } from 'lucide-react';

import { Input } from 'components/ui/input';
import { cn } from 'lib/utils';
import { WaiterCommand, WaiterProduct } from '../services/WaiterService';
import { WaiterShell } from '../WaiterShell';
import { availableStock } from './stock';

interface Props {
  command: WaiterCommand | null;
  products: WaiterProduct[];
  categories: string[];
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  cart: Record<string, number>;
  setQuantity: (product: WaiterProduct, quantity: number) => void;
  observation: string;
  setObservation: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isSending: boolean;
  isOutsideNetwork: boolean;
  handleSend: () => void;
  handleBack: () => void;
}

// Aviso curto de estoque ao lado do preço.
function stockHint(stock: number | null, isOut: boolean) {
  if (isOut) return ' · Esgotado';
  if (stock !== null && stock <= 5) return ` · Restam ${stock}`;
  return '';
}

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const StepButton = ({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-navy active:bg-secondary disabled:opacity-40"
  >
    {children}
  </button>
);

const ProductRow = ({
  product,
  quantity,
  setQuantity,
}: {
  product: WaiterProduct;
  quantity: number;
  setQuantity: Props['setQuantity'];
}) => {
  const stock = availableStock(product);
  const isOut = stock !== null && stock <= 0;
  const reachedStock = stock !== null && quantity >= stock;

  return (
    <div
      className={cn(
        'flex min-h-[4.25rem] items-center gap-3 rounded-card border bg-card p-3 shadow-sm',
        quantity > 0 ? 'border-gold' : 'border-border',
        isOut && 'opacity-60'
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-bold text-navy">{product.name}</span>
        <span className="text-xs text-text-muted">
          {formatPrice(product.unitPrice)}
          {stockHint(stock, isOut)}
        </span>
      </div>

      {quantity > 0 ? (
        <div className="flex items-center gap-1.5">
          <StepButton label={`Menos ${product.name}`} onClick={() => setQuantity(product, quantity - 1)}>
            <Minus className="h-5 w-5" />
          </StepButton>
          <input
            inputMode="decimal"
            aria-label={`Quantidade de ${product.name}`}
            value={quantity}
            onChange={(e) => setQuantity(product, Number(e.target.value.replace(',', '.')))}
            className="h-11 w-14 rounded-md border border-input bg-card text-center text-base font-extrabold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <StepButton
            label={`Mais ${product.name}`}
            onClick={() => setQuantity(product, quantity + 1)}
            disabled={reachedStock}
          >
            <Plus className="h-5 w-5" />
          </StepButton>
        </div>
      ) : (
        <button
          type="button"
          disabled={isOut}
          onClick={() => setQuantity(product, 1)}
          className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      )}
    </div>
  );
};

export const WaiterCommandLayout = ({
  command,
  products,
  categories,
  category,
  setCategory,
  search,
  setSearch,
  cart,
  setQuantity,
  observation,
  setObservation,
  isLoading,
  isSending,
  isOutsideNetwork,
  handleSend,
  handleBack,
}: Props) => {
  const [showLaunched, setShowLaunched] = useState(false);
  const cartCount = Object.keys(cart).length;
  const launched = command?.products || [];

  return (
    <WaiterShell title={command?.table || 'Comanda'} onBack={handleBack} isOutsideNetwork={isOutsideNetwork}>
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {!isLoading && command && (
        <>
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => setShowLaunched((prev) => !prev)}
              aria-expanded={showLaunched}
              className="flex min-h-11 w-full items-center justify-between rounded-card border border-border bg-card px-3 text-left text-sm font-bold text-navy"
            >
              <span>
                Já lançado ({launched.reduce((sum, item) => sum + item.amount, 0)})
              </span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', showLaunched && 'rotate-180')} />
            </button>
            {showLaunched && (
              <ul className="mt-2 flex flex-col gap-1 rounded-card bg-secondary p-3 text-sm text-navy">
                {launched.length === 0 && <li className="text-text-muted">Nada lançado ainda.</li>}
                {launched.map((item) => (
                  <li key={item._id} className="flex justify-between gap-2">
                    <span className="truncate">{item.name}</span>
                    <span className="font-bold">{item.amount}x</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sticky top-14 z-20 flex flex-col gap-2 bg-background px-3 pb-2 pt-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto"
              className="h-11 text-base"
            />
            <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    'h-10 shrink-0 rounded-full border px-4 text-sm font-bold',
                    category === item
                      ? 'border-navy bg-navy text-text-on-navy'
                      : 'border-border bg-card text-text-muted'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 px-3 pb-44">
            {products.length === 0 && (
              <p className="py-10 text-center text-sm text-text-muted">Nenhum produto encontrado.</p>
            )}
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                quantity={cart[product._id] || 0}
                setQuantity={setQuantity}
              />
            ))}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
            <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
              {cartCount > 0 && (
                <Input
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Observação para cozinha ou bar (opcional)"
                  maxLength={300}
                  className="h-11 text-base"
                />
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={cartCount === 0 || isSending}
                className="flex h-14 items-center justify-center gap-2 rounded-(--radius-md) bg-primary text-base font-bold text-primary-foreground shadow-card active:scale-[0.98] disabled:opacity-50"
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {cartCount === 0
                  ? 'Escolha os itens'
                  : `Enviar pedido (${cartCount} ${cartCount === 1 ? 'item' : 'itens'})`}
              </button>
            </div>
          </div>
        </>
      )}
    </WaiterShell>
  );
};
