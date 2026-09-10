import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

type Props = {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleDeleteProduct: () => void;
  isDeleting: boolean;
};

export const DeleteProductModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleDeleteProduct,
  isDeleting,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Deletar Item?">
    <div className="flex gap-3">
      <Button className="flex-1" variant="secondary" onClick={() => handleCloseModal()}>
        Cancelar
      </Button>
      <Button className="flex-1" variant="destructive" onClick={() => handleDeleteProduct()} disabled={isDeleting}>
        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isDeleting ? 'Removendo' : 'Remover'}
      </Button>
    </div>
  </Modal>
);
