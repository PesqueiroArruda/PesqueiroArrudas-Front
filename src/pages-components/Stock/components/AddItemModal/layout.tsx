import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

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

type Props = {
  handleSubmit: any;
  isModalOpen: boolean;
  handleCloseModal: any;
  unitPrice: any;
  handleChangeUnitPrice: any;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  isSubmitting: boolean;
};

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const AddItemModalLayout = ({
  isModalOpen,
  handleSubmit,
  handleCloseModal,
  handleChangeUnitPrice,
  unitPrice,
  name,
  setName,
  category,
  setCategory,
  amount,
  setAmount,
  isSubmitting,
}: Props) => (
  <Modal isOpen={isModalOpen} title="Adicionar Item" onClose={handleCloseModal} size="2xl">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-navy">Nome do produto *</span>
        <Input placeholder="Coca-Cola" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-navy">Categoria *</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClassName}>
          <option value="">Selecione uma categoria</option>
          {categories.map((categorie) => (
            <option key={`categorie-select-list-${categorie}`}>{categorie}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-navy">Quantidade *</span>
        <Input
          type="number"
          min={1}
          step={1}
          placeholder="Quantidade"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-navy">Preço da unidade *</span>
        <Input placeholder="R$ Preço da Unidade *" value={unitPrice} onChange={(e) => handleChangeUnitPrice(e)} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Adicionando' : 'Adicionar'}
      </Button>
    </form>
  </Modal>
);
