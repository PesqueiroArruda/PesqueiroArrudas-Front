import { Loader2, Link2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { ProductCombobox } from 'components/ProductCombobox';
import { Product } from 'types/Product';
import { StockSourceSuggestion } from 'utils/suggestStockSource';

export interface LinkRow {
  product: Product;
  suggestion: StockSourceSuggestion | null;
}

export interface LinkSelection {
  sourceId: string | null;
  checked: boolean;
}

type Props = {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  rows: LinkRow[];
  sourceOptions: Product[];
  selections: Record<string, LinkSelection>;
  handleChangeSource: (productId: string, sourceId: string) => void;
  handleToggleChecked: (productId: string, checked: boolean) => void;
  handleApply: () => void;
  isApplying: boolean;
  selectedCount: number;
};

function confidenceBadge(suggestion: StockSourceSuggestion | null) {
  if (!suggestion) return <Badge variant="outline">Sem sugestão</Badge>;
  if (suggestion.confidence === 'exact') return <Badge variant="success">Nome igual</Badge>;
  return <Badge variant="gold">Parecido, confira</Badge>;
}

export const LinkIfoodProductsModalLayout = ({
  isModalOpen,
  handleCloseModal,
  rows,
  sourceOptions,
  selections,
  handleChangeSource,
  handleToggleChecked,
  handleApply,
  isApplying,
  selectedCount,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Vincular produtos do iFood" size="2xl">
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-muted">
        Cada produto do iFood passa a usar o estoque do produto escolhido, com o mesmo saldo nos dois. Preço, nome e
        categoria continuam separados. As sugestões vêm do nome, então confira antes de vincular.
      </p>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">Nenhum produto do iFood sem vínculo.</p>
      ) : (
        <div className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto pr-1">
          {rows.map(({ product, suggestion }) => {
            const id = product._id as string;
            const selection = selections[id];
            return (
              <div
                key={`link-${id}`}
                className="flex flex-col gap-2 rounded-(--radius) border border-border bg-card px-3 py-2 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-navy">
                  <input
                    id={`link-check-${id}`}
                    type="checkbox"
                    checked={Boolean(selection?.checked && selection?.sourceId)}
                    disabled={!selection?.sourceId}
                    onChange={(e) => handleToggleChecked(id, e.target.checked)}
                    className="h-4 w-4 shrink-0 accent-gold"
                  />
                  <label htmlFor={`link-check-${id}`} className="min-w-0">
                    <span className="block truncate">{product.name}</span>
                    <span className="block text-xs font-normal text-text-muted">
                      saldo atual no cadastro: {product.amount}
                    </span>
                  </label>
                </div>
                <div className="flex flex-col gap-1 sm:w-72">
                  <ProductCombobox
                    products={sourceOptions.filter((option) => option._id !== id)}
                    value={selection?.sourceId ?? null}
                    onChange={(sourceId) => handleChangeSource(id, sourceId)}
                    placeholder="Escolher produto de origem"
                  />
                  <div>{confidenceBadge(suggestion)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCloseModal} disabled={isApplying}>
          Fechar
        </Button>
        <Button onClick={handleApply} disabled={isApplying || selectedCount === 0}>
          {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
          Vincular selecionados ({selectedCount})
        </Button>
      </div>
    </div>
  </Modal>
);
