import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

type Props = {
  isModalOpen: boolean;
  handleCloseModal: any;
  handleDeleteItem: any;
  isDeleting: boolean;
};

export const DeleteItemModalLayout = ({ isModalOpen, handleCloseModal, handleDeleteItem, isDeleting }: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Deletar item?">
    <div className="flex gap-2">
      <Button className="flex-1" variant="secondary" onClick={() => handleCloseModal()}>
        Cancelar
      </Button>
      <Button className="flex-1" variant="destructive" onClick={() => handleDeleteItem()} disabled={isDeleting}>
        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isDeleting ? 'Deletando' : 'Deletar'}
      </Button>
    </div>
  </Modal>
);
