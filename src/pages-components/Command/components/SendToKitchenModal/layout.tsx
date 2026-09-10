import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSendToKitchen: () => void;
  isSending: boolean;
  observation: string;
  setObservation: Dispatch<SetStateAction<string>>;
}

export const SendToKitchenModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handleSendToKitchen,
  isSending,
  observation,
  setObservation,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={() => handleCloseModal()} title="Mandar para Cozinha?">
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-navy">Observações:</span>
      <textarea
        placeholder="Ex: Coca Cola com gelo e limão"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        className="min-h-[90px] w-full rounded-(--radius) border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-2 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={() => handleSendToKitchen()} disabled={isSending}>
          {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSending ? 'Enviando' : 'Mandar'}
        </Button>
      </div>
    </div>
  </Modal>
);
