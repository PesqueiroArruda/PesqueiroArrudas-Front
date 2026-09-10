/* eslint-disable no-unused-vars */
import { SubmitHandler } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

type AddCommandInputs = {
  table: string;
  waiter: string;
  fishingType: string;
  peopleCount: number;
};

type Props = {
  isModalOpen: boolean;
  handleCloseModal: () => any;
  handleAddCommand: SubmitHandler<AddCommandInputs>;
  rhfHandleSubmit: any;
  rhfRegister: any;
  rhfErrors: any;
  isAdding: boolean;
};

const selectClassName =
  'h-10 w-full cursor-pointer rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const AddCommandModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleAddCommand,
  rhfHandleSubmit,
  rhfRegister,
  rhfErrors,
  isAdding,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Adicionar Comanda">
    <form onSubmit={rhfHandleSubmit(handleAddCommand)} className="flex flex-col gap-4">
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

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Tipo de Pesca</span>
        <select {...rhfRegister('fishingType')} className={selectClassName}>
          <option>Nenhum</option>
          <option>Pesca Esportiva</option>
          <option>Pesque Pague</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Quantidade de pessoas</span>
        <Input
          type="number"
          min={1}
          defaultValue={1}
          {...rhfRegister('peopleCount', { valueAsNumber: true, min: 1 })}
        />
      </div>

      <Button type="submit" disabled={isAdding}>
        {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
        {isAdding ? 'Adicionando' : 'Adicionar'}
      </Button>
    </form>
  </Modal>
);
