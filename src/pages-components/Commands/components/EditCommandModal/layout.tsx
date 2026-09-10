import { SubmitHandler } from 'react-hook-form';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

interface EditCommandInputs {
  table: string;
  waiter: string;
}

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleEditCommand: SubmitHandler<EditCommandInputs>;
  rhfRegister: any;
  rhfErrors: any;
  rhfHandleSubmit: any;
}

export const EditCommandModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleEditCommand,
  rhfHandleSubmit,
  rhfRegister,
  rhfErrors,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar comanda">
    <form onSubmit={rhfHandleSubmit(handleEditCommand)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Mesa:</span>
        <Input placeholder="João" {...rhfRegister('table', { required: true })} />
        {rhfErrors?.table && <span className="text-sm text-destructive">Esse campo é necessário</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Garçom:</span>
        <Input placeholder="Fulano..." {...rhfRegister('waiter', { required: true })} />
        {rhfErrors?.waiter && <span className="text-sm text-destructive">Esse campo é necessário</span>}
      </div>

      <Button type="submit">Atualizar</Button>
    </form>
  </Modal>
);
