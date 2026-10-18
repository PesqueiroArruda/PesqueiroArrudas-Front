import { SubmitHandler } from 'react-hook-form';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { COMMAND_LOCATIONS } from 'utils/commandLocation';

interface EditCommandInputs {
  table: string;
  location: string;
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

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

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
        <span className="text-sm font-semibold text-navy">Local:</span>
        <select {...rhfRegister('location')} className={selectClassName}>
          <option value="">Sem local</option>
          {COMMAND_LOCATIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
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
