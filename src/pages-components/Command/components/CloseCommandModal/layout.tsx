/* eslint-disable no-param-reassign */
import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Command } from 'types/Command';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  isModalOpen: boolean;
  isClosing: boolean;
  handleCloseModal: () => void;
  waiterExtra: string;
  setWaiterExtra: Dispatch<SetStateAction<string>>;
  waiterExtraPercent: number;
  setWaiterExtraPercent: Dispatch<SetStateAction<number>>;
  command: Command;
  observation: { current: string };
  handleCloseCommand: () => void;
}

const summaryBoxClassName =
  'flex items-center justify-center rounded-card bg-secondary px-4 py-2 text-center text-sm text-navy shadow-sm sm:text-base';

const selectClassName =
  'h-10 flex-1 rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export const CloseCommandModalLayout = ({
  isModalOpen,
  isClosing,
  handleCloseModal,
  waiterExtra,
  setWaiterExtra,
  waiterExtraPercent,
  setWaiterExtraPercent,
  command,
  observation,
  handleCloseCommand,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Fechar Comanda" size="2xl">
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={summaryBoxClassName}>
          Mesa: <span className="ml-1 font-bold">{command?.table}</span>
        </div>
        <div className={summaryBoxClassName}>
          Total: <span className="ml-1 font-bold">{parseToBRL(command?.total || 0)}</span>
        </div>
        <div className={summaryBoxClassName}>
          Total Pago: <span className="ml-1 font-bold">{parseToBRL(command?.totalPayed || 0)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-navy">
          Caixinha do garçom: <span className="font-bold">{command?.waiter}</span>
        </span>
        <div className="flex items-center gap-3">
          <Input
            disabled={isClosing}
            value={waiterExtra}
            onChange={(e) => setWaiterExtra(e.target.value)}
            placeholder="Ex: R$ 23,90"
            className="flex-1"
          />
          <select
            disabled={isClosing}
            value={waiterExtraPercent}
            onChange={(e) => setWaiterExtraPercent(Number(e.target.value))}
            className={selectClassName}
          >
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-navy">Observações</span>
        <Input
          disabled={isClosing}
          placeholder="Ex: Deixou para pagar 50 reais depois"
          onChange={(e) => {
            observation.current = e.target.value;
          }}
        />
      </div>

      <div className="flex gap-3">
        <Button className="flex-1" variant="secondary" onClick={handleCloseModal} disabled={isClosing}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={() => handleCloseCommand()} disabled={isClosing}>
          {isClosing && <Loader2 className="h-4 w-4 animate-spin" />}
          Fechar Comanda
        </Button>
      </div>
    </div>
  </Modal>
);
