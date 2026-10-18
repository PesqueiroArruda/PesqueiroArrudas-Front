import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SocketContext } from 'pages/_app';
import { useContext, useEffect, useMemo, useState } from 'react';
import WaiterService, { WaiterCommand } from '../services/WaiterService';
import { isOutsideNetworkError } from '../WaiterShell';
import { WaiterCommandsLayout } from './layout';

export const WaiterCommands = () => {
  const [commands, setCommands] = useState<WaiterCommand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOutsideNetwork, setIsOutsideNetwork] = useState(false);
  const [search, setSearch] = useState('');
  const [loggedUser, setLoggedUser] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setLoggedUser(localStorage.getItem('loggedUser') || '');

    (async () => {
      try {
        setCommands(await WaiterService.getCommands());
      } catch (error: any) {
        if (isOutsideNetworkError(error)) setIsOutsideNetwork(true);
        else {
          toast({
            status: 'error',
            title: error?.response?.data?.message || 'Não foi possível carregar as comandas.',
          });
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onCreated = (command: WaiterCommand) =>
      setCommands((prev) =>
        prev.some(({ _id }) => _id === command._id) ? prev : [command, ...prev]
      );
    const onUpdated = (command: WaiterCommand) =>
      setCommands((prev) => {
        const exists = prev.some(({ _id }) => _id === command._id);
        if (command.isActive === false) return prev.filter(({ _id }) => _id !== command._id);
        return exists
          ? prev.map((item) => (item._id === command._id ? command : item))
          : [command, ...prev];
      });
    const onDeleted = (commandId: string) =>
      setCommands((prev) => prev.filter(({ _id }) => _id !== commandId));

    socket.on('command-created', onCreated);
    socket.on('command-updated', onUpdated);
    socket.on('command-deleted', onDeleted);

    return () => {
      socket.off('command-created', onCreated);
      socket.off('command-updated', onUpdated);
      socket.off('command-deleted', onDeleted);
    };
  }, [socket]);

  // As minhas primeiro, depois as demais por nome da mesa.
  const visibleCommands = useMemo(() => {
    const term = search.trim().toLowerCase();
    return commands
      .filter((command) => command.isActive !== false)
      .filter((command) => !term || command.table.toLowerCase().includes(term))
      .sort((a, b) => {
        const aMine = a.waiter === loggedUser ? 0 : 1;
        const bMine = b.waiter === loggedUser ? 0 : 1;
        return aMine - bMine || a.table.localeCompare(b.table, 'pt-BR', { numeric: true });
      });
  }, [commands, search, loggedUser]);

  async function handleCreate(payload: {
    table: string;
    fishingType: string;
    peopleCount: number;
  }) {
    if (isCreating) return;
    try {
      setIsCreating(true);
      const command = await WaiterService.createCommand(payload);
      router.push(`/garcom/${command._id}`);
    } catch (error: any) {
      setIsCreating(false);
      if (isOutsideNetworkError(error)) {
        setIsOutsideNetwork(true);
        return;
      }
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível criar a comanda.',
      });
    }
  }

  return (
    <WaiterCommandsLayout
      commands={visibleCommands}
      isLoading={isLoading}
      isOutsideNetwork={isOutsideNetwork}
      isCreating={isCreating}
      loggedUser={loggedUser}
      search={search}
      setSearch={setSearch}
      handleOpen={(id) => router.push(`/garcom/${id}`)}
      handleCreate={handleCreate}
    />
  );
};
