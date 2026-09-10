import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleCheckOrder: () => void;
  isSending: boolean;
}

export const CheckOrderModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleCheckOrder,
  isSending,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Marcar Pedido como Feito">
    <div className="flex gap-3">
      <Button className="flex-1" variant="secondary" onClick={() => handleCloseModal()}>
        Cancelar
      </Button>
      <Button className="flex-1" onClick={() => handleCheckOrder()} disabled={isSending}>
        {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSending ? 'Enviando' : 'Confirmar'}
      </Button>
    </div>
  </Modal>
);
