import { Loader2, Merge } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Product } from 'pages-components/Stock/types/Product';
import { parseToBRL } from 'utils/parseToBRL';

type Props = {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  groups: Product[][];
  survivorByGroup: Record<number, string>;
  excludedByGroup: Record<number, Set<string>>;
  handleSelectSurvivor: (groupIndex: number, productId: string) => void;
  handleToggleExclude: (groupIndex: number, productId: string, include: boolean) => void;
  handleMergeGroup: (groupIndex: number) => void;
  mergingGroupIndex: number | null;
};

export const MergeDuplicatesModalLayout = ({
  isModalOpen,
  handleCloseModal,
  groups,
  survivorByGroup,
  excludedByGroup,
  handleSelectSurvivor,
  handleToggleExclude,
  handleMergeGroup,
  mergingGroupIndex,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Itens parecidos" size="2xl">
    <div className="flex flex-col gap-5">
      {groups.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Nenhum item parecido encontrado no estoque.
        </p>
      ) : (
        groups.map((group, groupIndex) => {
          const survivorId = survivorByGroup[groupIndex] || group[0]._id || '';
          const excluded = excludedByGroup[groupIndex] || new Set<string>();
          const isMerging = mergingGroupIndex === groupIndex;

          const groupKey = group.map((product) => product._id).join('-');

          return (
            <div key={groupKey} className="rounded-card border border-border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Grupo {groupIndex + 1} — escolha qual item fica
              </p>
              <div className="flex flex-col gap-2">
                {group.map((product) => {
                  const isSurvivor = product._id === survivorId;
                  const isIncluded = isSurvivor || !excluded.has(product._id || '');

                  return (
                    <div
                      key={`product-${product._id}`}
                      className="flex flex-wrap items-center gap-3 rounded-(--radius) border border-border bg-card px-3 py-2"
                    >
                      <input
                        id={`merge-survivor-${groupIndex}-${product._id}`}
                        type="radio"
                        name={`merge-survivor-${groupIndex}`}
                        checked={isSurvivor}
                        onChange={() => handleSelectSurvivor(groupIndex, product._id || '')}
                        aria-label={`Manter ${product.name} como sobrevivente`}
                        className="h-3.5 w-3.5 accent-gold"
                      />
                      <span className="flex-1 text-sm font-semibold text-navy">{product.name}</span>
                      <span className="text-xs text-text-muted">{product.category}</span>
                      <span className="text-xs text-text-muted">Qntd: {product.amount}</span>
                      <span className="text-xs text-text-muted">{parseToBRL(product.unitPrice || 0)}</span>
                      {!isSurvivor && (
                        <label
                          htmlFor={`merge-include-${groupIndex}-${product._id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-navy"
                        >
                          <input
                            id={`merge-include-${groupIndex}-${product._id}`}
                            type="checkbox"
                            checked={isIncluded}
                            onChange={(e) =>
                              handleToggleExclude(groupIndex, product._id || '', e.target.checked)
                            }
                            className="h-3.5 w-3.5 rounded border-border accent-gold"
                          />
                          Juntar
                        </label>
                      )}
                      {isSurvivor && (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold-strong">
                          Sobrevivente
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-text-muted">
                A quantidade dos itens marcados &quot;Juntar&quot; é somada no sobrevivente; nome, categoria
                e preço do sobrevivente não mudam.
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  disabled={isMerging}
                  onClick={() => handleMergeGroup(groupIndex)}
                >
                  {isMerging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Merge className="h-4 w-4" />}
                  Mesclar grupo
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  </Modal>
);
