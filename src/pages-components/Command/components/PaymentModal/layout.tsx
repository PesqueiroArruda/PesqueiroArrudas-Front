import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Command } from 'types/Command';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  isModalOpen: boolean;
  command: Command;
  handleCloseModal: () => void;
  handleMakePayment: (e: any) => void;
  exchange: string;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
  receivedValue: string;
  totalValuePayment: boolean;
  setReceivedValue: Dispatch<SetStateAction<string>>;
  setTotalValuePayment: Dispatch<SetStateAction<boolean>>;
  isReceivedValueInvalid: { value: boolean; message: string };
  totalToBePayed: number;
  isPaying: boolean;
}

const paymentOptions = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Ifood'];

const summaryBoxClassName =
  'flex items-center justify-center rounded-card bg-secondary px-4 py-2 text-center text-sm text-navy shadow-sm sm:text-base';

export const PaymentModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleMakePayment,
  command,
  exchange,
  paymentType,
  setPaymentType,
  receivedValue,
  setReceivedValue,
  setTotalValuePayment,
  totalValuePayment,
  isReceivedValueInvalid,
  totalToBePayed,
  isPaying,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Pagamento" size="full">
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        <div className={summaryBoxClassName}>
          Mesa: <span className="ml-1 font-bold">{command?.table}</span>
        </div>
        <div className={`${summaryBoxClassName} border-2 border-cyan`}>
          Total: <span className="ml-1 font-bold">{parseToBRL(command?.total || 0)}</span>
        </div>
        <div className={summaryBoxClassName}>
          Pago: <span className="ml-1 font-bold">{parseToBRL(command?.totalPayed || 0)}</span>
        </div>
        <div className={`${summaryBoxClassName} border-2 border-destructive`}>
          A pagar: <span className="ml-1 font-bold">{parseToBRL(totalToBePayed || 0)}</span>
        </div>
      </div>

      <hr className="border-border" />

      <form onSubmit={(e) => handleMakePayment(e)} className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-navy">Valor Recebido</span>
            <Input
              placeholder="Ex: R$ 23,90"
              value={receivedValue}
              onChange={(e) => setReceivedValue(e.target.value)}
              disabled={totalValuePayment}
            />
            {isReceivedValueInvalid.value && (
              <span className="text-sm text-destructive">
                {isReceivedValueInvalid.message || 'Campo obrigatório'}
              </span>
            )}
            <label htmlFor="payment-total-value" className="flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                id="payment-total-value"
                type="checkbox"
                checked={totalValuePayment}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTotalValuePayment(true);
                    setReceivedValue(totalToBePayed.toString());
                  } else {
                    setTotalValuePayment(false);
                    setReceivedValue('');
                  }
                }}
                className="h-4 w-4 rounded border-border accent-gold"
              />
              Valor total
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-navy">Método de Pagamento</span>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {paymentOptions.map((payment) => (
                <option key={`payment-option-${payment}`}>{payment}</option>
              ))}
            </select>
          </div>
        </div>

        {paymentType === 'Dinheiro' && exchange && (
          <div className="rounded-card bg-secondary px-4 py-3 text-center shadow-sm">
            <span className="text-lg font-bold text-navy">
              Troco: <span className="text-destructive">{parseToBRL(Number(exchange) || 0)}</span>
            </span>
          </div>
        )}

        <hr className="border-border" />

        <div className="grid gap-3 md:grid-cols-2">
          <Button type="button" variant="secondary" size="lg" onClick={() => handleCloseModal()}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" disabled={isPaying}>
            {isPaying && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPaying ? 'Pagando' : 'Confirmar Pagamento'}
          </Button>
        </div>
      </form>
    </div>
  </Modal>
);
