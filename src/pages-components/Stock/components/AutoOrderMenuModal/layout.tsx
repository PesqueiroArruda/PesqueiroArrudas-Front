import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

type Props = {
  isModalOpen: boolean;
  handleCloseModal: any;
  handleAutoOrderMenu: any;
  isOrdering: boolean;
};

export const AutoOrderMenuModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleAutoOrderMenu,
  isOrdering,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Ordenar cardápio automaticamente?">
    <p className="mb-4 text-sm text-text-muted">
      Isso vai reordenar todos os itens habilitados no cardápio digital por categoria e nome,
      sobrescrevendo qualquer ordem manual já definida em cada item.
    </p>
    <div className="flex gap-2">
      <Button className="flex-1" variant="secondary" onClick={() => handleCloseModal()}>
        Cancelar
      </Button>
      <Button className="flex-1" onClick={() => handleAutoOrderMenu()} disabled={isOrdering}>
        {isOrdering && <Loader2 className="h-4 w-4 animate-spin" />}
        {isOrdering ? 'Ordenando' : 'Ordenar'}
      </Button>
    </div>
  </Modal>
);
