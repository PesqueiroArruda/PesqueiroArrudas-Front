import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleDeleteCommand: () => void;
  isDeleting: boolean;
}

export const DeleteCommandModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleDeleteCommand,
  isDeleting,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Deletar comanda">
    <div className="flex gap-3">
      <Button className="flex-1" variant="secondary" onClick={() => handleCloseModal()}>
        Cancelar
      </Button>
      <Button className="flex-1" variant="destructive" onClick={() => handleDeleteCommand()} disabled={isDeleting}>
        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isDeleting ? 'Deletando' : 'Deletar'}
      </Button>
    </div>
  </Modal>
);
