import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import type { Item } from '../../types/Item';

interface Props {
  isEditModalOpen: boolean;
  onClose: any;
  title: any;
  itemInfos: Item;
  handleSubmit: any;
  handleChangeUnitPrice: any;
  isSubmitting: boolean;
}

const categories = [
  'Pesca',
  'Peixes',
  'Pratos',
  'Bebidas',
  'Bebidas-Cozinha',
  'Doses',
  'Sobremesas',
  'Porções',
  'Misturas Congeladas',
];

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const EditModalLayout = ({
  isEditModalOpen,
  onClose,
  title,
  itemInfos,
  handleSubmit,
  handleChangeUnitPrice,
  isSubmitting,
}: Props) => (
  <Modal isOpen={isEditModalOpen} onClose={onClose} title={title}>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-navy">Nome</span>
      <Input placeholder="Nome" value={itemInfos.name} onChange={(e) => itemInfos.setName(e.target.value)} />

      <span className="text-sm font-semibold text-navy">Categoria</span>
      <select
        value={itemInfos.category || ''}
        onChange={(e) => itemInfos.setCategory(e.target.value)}
        className={selectClassName}
      >
        {categories.map((categorie) => (
          <option key={`edit-categorie-${categorie}`}>{categorie}</option>
        ))}
      </select>

      <span className="text-sm font-semibold text-navy">Preço da unidade</span>
      <Input placeholder="Preço da Unidade" value={itemInfos.unitPrice || ''} onChange={(e) => handleChangeUnitPrice(e)} />

      <span className="text-sm font-semibold text-navy">Quantidade</span>
      <Input
        type="number"
        placeholder="Quantidade"
        value={itemInfos.amount || ''}
        onChange={(e) => itemInfos.setAmount(Number(e.target.value))}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Atualizando' : 'Atualizar Item'}
      </Button>
    </form>
  </Modal>
);
