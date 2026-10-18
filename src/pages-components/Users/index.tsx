import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import UsersService, {
  AppUser,
  NetworkSettings,
  UserDevice,
} from './services/UsersService';
import { UsersLayout } from './layout';

export const Users = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [network, setNetwork] = useState<NetworkSettings | null>(null);
  const [devicesByUser, setDevicesByUser] = useState<Record<string, UserDevice[]>>({});

  const toast = useToast();

  const notify = useCallback(
    (status: 'success' | 'error', title: string) => {
      toast.closeAll();
      toast({ status, title, duration: 2500, isClosable: true });
    },
    [toast]
  );

  // Ação com tratamento de erro padrão; devolve true se deu certo.
  const run = useCallback(
    async (action: () => Promise<unknown>, successMessage?: string) => {
      try {
        await action();
        if (successMessage) notify('success', successMessage);
        return true;
      } catch (error: any) {
        notify('error', error?.response?.data?.message || 'Algo deu errado. Tente de novo.');
        return false;
      }
    },
    [notify]
  );

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await UsersService.list());
    } catch (error: any) {
      notify('error', error?.response?.data?.message || 'Não foi possível carregar a equipe.');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const loadNetwork = useCallback(async () => {
    try {
      setNetwork(await UsersService.getNetwork());
    } catch (error) {
      setNetwork(null);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadNetwork();
  }, [loadUsers, loadNetwork]);

  async function handleCreate(payload: {
    name: string;
    username: string;
    password: string;
    role: string;
  }) {
    const ok = await run(() => UsersService.create(payload), 'Usuário criado');
    if (ok) await loadUsers();
    return ok;
  }

  async function handleUpdate(
    id: string,
    payload: Partial<{ name: string; role: string; isActive: boolean; password: string }>,
    successMessage: string
  ) {
    const ok = await run(() => UsersService.update(id, payload), successMessage);
    if (ok) await loadUsers();
    return ok;
  }

  async function handleLoadDevices(id: string) {
    try {
      const devices = await UsersService.devices(id);
      setDevicesByUser((prev) => ({ ...prev, [id]: devices }));
    } catch (error: any) {
      notify('error', error?.response?.data?.message || 'Não foi possível carregar os aparelhos.');
    }
  }

  async function handleRevokeDevice(userId: string, deviceId: string, revoked: boolean) {
    const ok = await run(
      () => UsersService.setDeviceRevoked(userId, deviceId, revoked),
      revoked ? 'Aparelho bloqueado' : 'Aparelho liberado'
    );
    if (ok) await handleLoadDevices(userId);
  }

  async function handleNetworkAction(
    action: () => Promise<NetworkSettings>,
    successMessage: string
  ) {
    try {
      setNetwork(await action());
      notify('success', successMessage);
    } catch (error: any) {
      notify('error', error?.response?.data?.message || 'Algo deu errado. Tente de novo.');
    }
  }

  return (
    <UsersLayout
      users={users}
      isLoading={isLoading}
      network={network}
      devicesByUser={devicesByUser}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      handleLoadDevices={handleLoadDevices}
      handleRevokeDevice={handleRevokeDevice}
      handleUseCurrentIp={() =>
        handleNetworkAction(
          () => UsersService.allowCurrentIp(),
          'Esta rede agora é a do pesqueiro'
        )
      }
      handleSaveNetwork={(allowedIps, allowedHosts) =>
        handleNetworkAction(
          () => UsersService.updateNetwork({ allowedIps, allowedHosts }),
          'Rede salva'
        )
      }
      handleBypass={(minutes) =>
        handleNetworkAction(
          () => UsersService.bypass(minutes),
          minutes > 0 ? 'Acesso externo liberado' : 'Trava de rede reativada'
        )
      }
    />
  );
};
