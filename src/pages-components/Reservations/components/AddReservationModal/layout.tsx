/* eslint-disable no-unused-vars */
import { SubmitHandler } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

export type AddReservationInputs = {
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  environment: string;
  paymentStatus: string;
  notes: string;
};

type Props = {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleAddReservation: SubmitHandler<AddReservationInputs>;
  rhfHandleSubmit: any;
  rhfRegister: any;
  rhfErrors: any;
  isAdding: boolean;
};

const selectClassName =
  'h-10 w-full cursor-pointer rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const AddReservationModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleAddReservation,
  rhfHandleSubmit,
  rhfRegister,
  rhfErrors,
  isAdding,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Nova reserva">
    <form
      onSubmit={rhfHandleSubmit(handleAddReservation)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Cliente:</span>
        <Input
          placeholder="Nome do cliente"
          {...rhfRegister('customerName', { required: true })}
        />
        {rhfErrors?.customerName && (
          <span className="text-sm text-destructive">
            Esse campo é necessário
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Telefone:</span>
        <Input
          placeholder="(00) 00000-0000"
          {...rhfRegister('customerPhone', { required: true })}
        />
        {rhfErrors?.customerPhone && (
          <span className="text-sm text-destructive">
            Esse campo é necessário
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-navy">Data:</span>
          <Input
            type="date"
            {...rhfRegister('reservationDate', { required: true })}
          />
          {rhfErrors?.reservationDate && (
            <span className="text-sm text-destructive">Obrigatório</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-navy">Hora:</span>
          <Input
            type="time"
            {...rhfRegister('reservationTime', { required: true })}
          />
          {rhfErrors?.reservationTime && (
            <span className="text-sm text-destructive">Obrigatório</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">
          Quantidade de pessoas
        </span>
        <Input
          type="number"
          min={1}
          defaultValue={1}
          {...rhfRegister('partySize', {
            valueAsNumber: true,
            min: 1,
            required: true,
          })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Ambiente</span>
        <select
          {...rhfRegister('environment', { required: true })}
          className={selectClassName}
        >
          <option value="interno">Interno</option>
          <option value="quiosque">Quiosque</option>
          <option value="externo">Externo</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">
          Status do pagamento
        </span>
        <select
          {...rhfRegister('paymentStatus', { required: true })}
          className={selectClassName}
        >
          <option value="paid">Paga</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">
          Observações (opcional):
        </span>
        <textarea
          placeholder="Ex: mesa perto da janela"
          {...rhfRegister('notes')}
          className="min-h-[70px] w-full rounded-(--radius) border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={isAdding}>
        {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
        {isAdding ? 'Criando' : 'Criar reserva'}
      </Button>
    </form>
  </Modal>
);
