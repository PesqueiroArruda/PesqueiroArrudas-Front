import {
  createContext,
  useMemo,
  useState,
  useReducer,
  useEffect,
  useContext,
} from 'react';
import { Box, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSound from 'use-sound';

import { Product } from 'types/Product';
import { SocketContext } from 'pages/_app';
import { Command } from 'types/Command';
import { IfoodOrder } from 'types/IfoodOrder';
import { downloadFile } from 'utils/downloadFile';
import { DateTime } from 'luxon';
import NotifySound from '../../../public/kitchenalarm.mp3';
import { ContextProps } from './types/ContextProps';
import { AddCommandModal } from './components/AddCommandModal';
import { CommandsLayout } from './layout';
import { commandsReducer } from './reducers/commandsReducer';
import CommandsService from './services/CommandsService';
import { stockProductsReducer } from './reducers/stockProductsReducer';

export const CommandsContext = createContext({} as ContextProps);

export const Commands = () => {
  const [allCommands, allCommandsDispatch] = useReducer(commandsReducer, {
    value: [],
  });
  const [stockProducts, stockProductsDispatch] = useReducer(
    stockProductsReducer,
    { value: [] as Product[] }
  );

  const [filter, setFilter] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderByDir, setOrderByDir] = useState('asc' as 'asc' | 'desc');
  const [searchContent, setSearchContent] = useState('');
  const [commandStatusFilter, setCommandStatusFilter] = useState<
    'Ativas' | 'Pagas'
  >('Ativas');

  const [isAddCommandModalOpen, setIsAddCommandModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const toast = useToast();
  const [playNotify] = useSound<any>(NotifySound);

  useEffect(() => {
    const hasCleanedAuthStorage = localStorage.getItem(
      'hasCleanedAuthStorage_v1'
    );

    if (!hasCleanedAuthStorage) {
      localStorage.removeItem('isLogged');
      localStorage.removeItem('isUser');

      localStorage.setItem('hasCleanedAuthStorage_v1', 'true');

      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    (async () => {
      const commands = await CommandsService.getAllCommands();
      allCommandsDispatch({
        type: 'ADD-ALL-COMMANDS',
        payload: { commands },
      });
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    const onCommandCreated = (newCommand: Command) => {
      allCommandsDispatch({
        type: 'ADD-ONE-COMMAND',
        payload: { command: newCommand },
      });
    };
    socket.on('command-created', onCommandCreated);

    const onCommandUpdated = (commandUpdated: Command) => {
      allCommandsDispatch({
        type: 'UPDATE-ONE-COMMAND',
        payload: { command: commandUpdated },
      });
    };
    socket.on('command-updated', onCommandUpdated);

    const onCommandDeleted = (commandId: string) => {
      allCommandsDispatch({
        type: 'REMOVE-ONE-COMMAND',
        payload: { commandId },
      });
    };
    socket.on('command-deleted', onCommandDeleted);

    const onProductUpdated = (updatedProduct: Product) => {
      stockProductsDispatch({
        type: 'UPDATE-ONE-PRODUCT',
        payload: { product: updatedProduct },
      });
    };
    socket.on('product-updated', onProductUpdated);

    const onIfoodOrderReceived = (ifoodOrder: IfoodOrder) => {
      playNotify();
      toast({
        status: 'info',
        duration: 8000,
        isClosable: true,
        render: () => (
          <Box
            onClick={() => router.push('/ifood-orders')}
            bg="#1c2b4a"
            color="white"
            borderRadius="md"
            px={4}
            py={3}
            cursor="pointer"
          >
            <Text fontWeight="bold">Novo pedido do iFood!</Text>
            <Text fontSize="sm">
              Pedido {ifoodOrder.ifoodOrderId} — clique para ver e aceitar
            </Text>
          </Box>
        ),
      });
    };
    socket.on('ifood-order-received', onIfoodOrderReceived);

    const onIfoodOrderCancelled = async ({ commandId }: { commandId: string | null }) => {
      playNotify();
      toast({
        status: 'warning',
        duration: 8000,
        isClosable: true,
        render: () => (
          <Box bg="#7a1f1f" color="white" borderRadius="md" px={4} py={3}>
            <Text fontWeight="bold">Pedido do iFood cancelado!</Text>
            {commandId && <Text fontSize="sm">A comanda foi marcada como cancelada.</Text>}
          </Box>
        ),
      });

      if (!commandId) return;

      const { command } = await CommandsService.getOneCommand({ commandId });
      if (command) {
        allCommandsDispatch({ type: 'UPDATE-ONE-COMMAND', payload: { command } });
      }
    };
    socket.on('ifood-order-cancelled', onIfoodOrderCancelled);

    return () => {
      socket.off('command-created', onCommandCreated);
      socket.off('command-updated', onCommandUpdated);
      socket.off('command-deleted', onCommandDeleted);
      socket.off('product-updated', onProductUpdated);
      socket.off('ifood-order-received', onIfoodOrderReceived);
      socket.off('ifood-order-cancelled', onIfoodOrderCancelled);
    };
  }, [socket, playNotify, toast, router]);

  function handleOpenAddCommandModal() {
    setIsAddCommandModalOpen(true);
  }

  function handleDownload(e: any) {
    e.preventDefault();

    const dt = DateTime.local().setZone('UTC-3').setLocale('pt-BR');

    downloadFile({
      data: JSON.stringify(allCommands.value),
      fileName: `comandas-${dt.day}-${dt.month}-${dt.year}.json`,
      fileType: 'text/json',
    });
  }

  const contextValues = useMemo(
    () => ({
      filter,
      setFilter,
      orderBy,
      setOrderBy,
      orderByDir,
      setOrderByDir,
      searchContent,
      setSearchContent,
      commandStatusFilter,
      setCommandStatusFilter,
      allCommands: allCommands.value,
      allCommandsDispatch,
      stockProducts: stockProducts.value,
      stockProductsDispatch,
    }),
    [
      filter,
      orderBy,
      orderByDir,
      searchContent,
      allCommands,
      allCommandsDispatch,
      commandStatusFilter,
      setCommandStatusFilter,
      stockProducts,
      stockProductsDispatch,
    ]
  );

  return (
    <CommandsContext.Provider value={contextValues}>
      <CommandsLayout
        handleOpenAddCommandModal={handleOpenAddCommandModal}
        isLoading={isLoading}
        commandStatusFilter={commandStatusFilter}
        setCommandStatusFilter={setCommandStatusFilter}
        handleDownload={handleDownload}
      />
      <AddCommandModal
        isModalOpen={isAddCommandModalOpen}
        setIsModalOpen={setIsAddCommandModalOpen}
      />
    </CommandsContext.Provider>
  );
};
