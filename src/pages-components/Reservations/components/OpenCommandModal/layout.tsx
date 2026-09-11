import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Reservation } from 'types/Reservation';

interface Props {
  isOpen: boolean;
  reservation: Reservation | null;
  waiter: string;
  isSubmitting: boolean;
  handleChangeWaiter: (value: string) => void;
  handleClose: () => void;
  handleConfirm: () => void;
}

export const OpenCommandModalLayout = ({
  isOpen,
  reservation,
  waiter,
  isSubmitting,
  handleChangeWaiter,
  handleClose,
  handleConfirm,
}: Props) => (
  <Modal isOpen={isOpen} onClose={handleClose} title="Abrir comanda">
    <div className="flex flex-col gap-4">
      {reservation && (
        <p className="text-sm text-navy">
          Abrir a comanda <span className="font-semibold">{`${reservation.customerName} Reserva`}</span> para{' '}
          <span className="font-semibold">{reservation.partySize}</span> pessoa(s)?
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-navy">Garçom:</span>
        <Input placeholder="Fulano..." value={waiter} onChange={(e) => handleChangeWaiter(e.target.value)} />
      </div>

      <Button type="button" disabled={isSubmitting || !waiter.trim()} onClick={handleConfirm}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Abrindo' : 'Abrir comanda'}
      </Button>
    </div>
  </Modal>
);
