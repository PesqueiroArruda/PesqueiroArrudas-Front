import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  discount: number;
  newDiscount: string;
  setNewDiscount: Dispatch<SetStateAction<string>>;
  percent: number;
  setPercent: Dispatch<SetStateAction<number>>;
  handleEditDiscount: () => void;
  isEditing: boolean;
}

export const DiscountLayout = ({
  handleCloseModal,
  isModalOpen,
  discount,
  newDiscount,
  setNewDiscount,
  handleEditDiscount,
  isEditing,
  percent,
  setPercent,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Desconto da comanda">
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold text-navy">Desconto da comanda: {parseToBRL(discount || 0)}</p>

      <div className="flex gap-3">
        <Input
          value={newDiscount}
          placeholder="Novo valor de desconto"
          onChange={(e) => setNewDiscount(e.target.value)}
          className="flex-2"
        />
        <select
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="h-10 flex-1 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value={0}>0%</option>
          <option value={5}>5%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
          <option value={50}>50%</option>
        </select>
      </div>

      <Button onClick={() => handleEditDiscount()} disabled={isEditing}>
        {isEditing && <Loader2 className="h-4 w-4 animate-spin" />}
        {isEditing ? 'Atualizando desconto' : 'Editar Desconto'}
      </Button>
    </div>
  </Modal>
);
