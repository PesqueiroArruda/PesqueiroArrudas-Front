import { useToast } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { CommandContext } from 'pages-components/Command';
import PaymentsService from 'pages-components/Command/services/PaymentsService';
import CommandService from 'pages-components/Command/services/CommandService';
import { getCommandBalance } from 'utils/getCommandBalance';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { formatDecimalNum } from 'utils/formatDecimalNum';
import { CloseCommandModalLayout } from './layout';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const CloseCommandModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [waiterExtra, setWaiterExtra] = useState('');
  const [waiterExtraPercent, setWaiterExtraPercent] = useState(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const closingRequest = useRef(false);
  const observation = useRef('');

  const { command, setCommand } = useContext(CommandContext);
  const toast = useToast();

  useEffect(() => {
    const percentageValue =
      Math.round(
        ((command?.total as number) * (waiterExtraPercent / 100) +
          Number.EPSILON) *
          100
      ) / 100;
    setWaiterExtra(
      formatDecimalNum({
        num: Number.isNaN(percentageValue) ? '0' : percentageValue.toString(),
        to: 'comma',
      })
    );
  }, [waiterExtraPercent, command.total]);

  useEffect(() => {
    if (!isModalOpen) return;
    if (!command?.createdAt) {
      setPaymentDate('');
      return;
    }
    // Default to the comanda's own opening date — the sale belongs to the
    // day the table was served, not necessarily whenever it gets paid.
    setPaymentDate(
      DateTime.fromISO(command.createdAt, {
        zone: 'America/Sao_Paulo',
        setZone: true,
      }).toFormat("yyyy-MM-dd'T'HH:mm")
    );
  }, [isModalOpen, command?.createdAt]);

  function handleCloseModal() {
    if (closingRequest.current) return;
    setIsModalOpen(false);
  }

  async function handleCloseCommand() {
    if (closingRequest.current) return;
    closingRequest.current = true;
    setIsClosing(true);
    try {
      if (!command._id)
        throw new Error('Command not loaded. Refresh the page.');

      const waiterExtraFormatted = Number(
        formatDecimalNum({ num: waiterExtra, to: 'point' })
      );

      if (!Number.isFinite(waiterExtraFormatted) || waiterExtraFormatted < 0) {
        toast({
          status: 'error',
          title: 'Valor da caixinha inválido.',
          duration: 1000,
          isClosable: true,
        });
        setIsClosing(false);
        return;
      }

      const { command: latestCommand } = await CommandService.getOneCommand({
        commandId: command._id,
      });
      if (!latestCommand) throw new Error('Command not found.');
      setCommand(latestCommand);
      if (latestCommand.isActive !== true) {
        throw new Error('This command is already closed.');
      }
      const balance = getCommandBalance(latestCommand);
      if (balance === null || balance > 0) {
        throw new Error('The command has an outstanding or invalid balance.');
      }

      const { paymentInfos } = await PaymentsService.pay({
        commandId: latestCommand._id,
        paymentTypes: latestCommand.paymentTypes || [],
        waiterExtra: waiterExtraFormatted,
        observation: observation.current,
        discount: latestCommand.discount || 0,
        paymentDate: paymentDate || undefined,
      });

      toast.closeAll();
      toast({
        status: 'success',
        title: 'Comanda fechada!',
        duration: 2000,
      });
      setIsModalOpen(false);
      setPaymentDate('');

      setCommand(paymentInfos.command);
    } catch (err: any) {
      setIsClosing(false);
      toast.closeAll();
      toast({
        status: 'error',
        title:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to close the command.',
        duration: 1000,
      });
    } finally {
      closingRequest.current = false;
      setIsClosing(false);
    }
  }

  return (
    <CloseCommandModalLayout
      isModalOpen={isModalOpen}
      isClosing={isClosing}
      handleCloseModal={handleCloseModal}
      waiterExtra={waiterExtra}
      setWaiterExtra={setWaiterExtra}
      waiterExtraPercent={waiterExtraPercent}
      setWaiterExtraPercent={setWaiterExtraPercent}
      command={command}
      observation={observation}
      paymentDate={paymentDate}
      setPaymentDate={setPaymentDate}
      handleCloseCommand={handleCloseCommand}
    />
  );
};
