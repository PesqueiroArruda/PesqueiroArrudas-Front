import { FormEvent, useState } from 'react';
import { DateTime } from 'luxon';
import { Loader2, Smartphone, UserCog } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AppUser, NetworkSettings, UserDevice } from './services/UsersService';

type UpdatePayload = Partial<{
  name: string;
  role: string;
  isActive: boolean;
  password: string;
}>;

interface Props {
  users: AppUser[];
  isLoading: boolean;
  network: NetworkSettings | null;
  devicesByUser: Record<string, UserDevice[]>;
  handleCreate: (payload: {
    name: string;
    username: string;
    password: string;
    role: string;
  }) => Promise<boolean>;
  handleUpdate: (id: string, payload: UpdatePayload, successMessage: string) => Promise<boolean>;
  handleLoadDevices: (id: string) => Promise<void>;
  handleRevokeDevice: (userId: string, deviceId: string, revoked: boolean) => Promise<void>;
  handleUseCurrentIp: () => Promise<void>;
  handleSaveNetwork: (allowedIps: string[], allowedHosts: string[]) => Promise<void>;
  handleBypass: (minutes: number) => Promise<void>;
}

const roleLabel = { admin: 'Administrador', waiter: 'Garçom' } as const;

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function formatDateTime(iso: string) {
  return DateTime.fromISO(iso).setLocale('pt-BR').toFormat("dd/MM/yyyy 'às' HH:mm");
}

const NewUserForm = ({ handleCreate }: Pick<Props, 'handleCreate'>) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter');
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    const ok = await handleCreate({ name, username, password, role });
    setIsSaving(false);
    if (ok) {
      setName('');
      setUsername('');
      setPassword('');
      setRole('waiter');
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:grid-cols-2"
    >
      <h2 className="font-heading text-lg font-extrabold text-navy sm:col-span-2">Novo usuário</h2>
      <Input placeholder="Nome (aparece nas comandas)" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder="Usuário de login"
        autoCapitalize="none"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Senha (mínimo 6 caracteres)"
        type="text"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClassName}>
        <option value="waiter">Garçom: só cria comandas e adiciona itens</option>
        <option value="admin">Administrador: acesso total</option>
      </select>
      <Button type="submit" disabled={isSaving} className="sm:col-span-2">
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        Criar usuário
      </Button>
    </form>
  );
};

const DevicesList = ({
  user,
  devices,
  handleRevokeDevice,
}: {
  user: AppUser;
  devices: UserDevice[];
  handleRevokeDevice: Props['handleRevokeDevice'];
}) => (
  <div className="mt-3 flex flex-col gap-2 rounded-md bg-secondary p-3">
    {devices.length === 0 && (
      <span className="text-sm text-text-muted">Nenhum aparelho entrou com esta conta ainda.</span>
    )}
    {devices.map((device) => (
      <div key={device._id} className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-navy">
            {device.userAgent || 'Aparelho sem identificação'}
          </span>
          <span className="text-xs text-text-muted">
            Último acesso {formatDateTime(device.lastSeenAt)}
          </span>
        </div>
        <Button
          size="sm"
          variant={device.revoked ? 'secondary' : 'destructive'}
          onClick={() => handleRevokeDevice(user._id, device._id, !device.revoked)}
        >
          {device.revoked ? 'Liberar' : 'Bloquear'}
        </Button>
      </div>
    ))}
  </div>
);

const UserCard = ({
  user,
  devices,
  handleUpdate,
  handleLoadDevices,
  handleRevokeDevice,
}: {
  user: AppUser;
  devices?: UserDevice[];
  handleUpdate: Props['handleUpdate'];
  handleLoadDevices: Props['handleLoadDevices'];
  handleRevokeDevice: Props['handleRevokeDevice'];
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  async function onResetPassword() {
    const ok = await handleUpdate(user._id, { password: newPassword }, 'Senha redefinida');
    if (ok) {
      setNewPassword('');
      setIsResetting(false);
    }
  }

  return (
    <div className="rounded-card border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-base font-extrabold text-navy">{user.name}</span>
          <span className="text-sm text-text-muted">@{user.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{roleLabel[user.role]}</Badge>
          <Badge variant={user.isActive ? 'default' : 'outline'}>{user.isActive ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setIsResetting((prev) => !prev)}>
          Redefinir senha
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            handleUpdate(
              user._id,
              { role: user.role === 'admin' ? 'waiter' : 'admin' },
              'Perfil atualizado'
            )
          }
        >
          Tornar {user.role === 'admin' ? 'garçom' : 'administrador'}
        </Button>
        <Button
          size="sm"
          variant={user.isActive ? 'destructive' : 'primary'}
          onClick={() =>
            handleUpdate(
              user._id,
              { isActive: !user.isActive },
              user.isActive ? 'Usuário desativado' : 'Usuário reativado'
            )
          }
        >
          {user.isActive ? 'Desativar' : 'Reativar'}
        </Button>
        {user.role === 'waiter' && (
          <Button size="sm" variant="ghost" onClick={() => handleLoadDevices(user._id)}>
            <Smartphone className="h-4 w-4" />
            Aparelhos
          </Button>
        )}
      </div>

      {isResetting && (
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Nova senha (mínimo 6 caracteres)"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={onResetPassword} disabled={newPassword.length < 6}>
            Salvar
          </Button>
        </div>
      )}

      {devices && (
        <DevicesList user={user} devices={devices} handleRevokeDevice={handleRevokeDevice} />
      )}
    </div>
  );
};

const NetworkPanel = ({
  network,
  handleUseCurrentIp,
  handleSaveNetwork,
  handleBypass,
}: Pick<Props, 'network' | 'handleUseCurrentIp' | 'handleSaveNetwork' | 'handleBypass'>) => {
  const [hostInput, setHostInput] = useState('');

  if (!network) {
    return <span className="text-sm text-text-muted">Carregando configuração de rede...</span>;
  }

  const bypassActive = network.bypassUntil && new Date(network.bypassUntil) > new Date();
  const isConfigured = network.allowedIps.length > 0 || network.allowedHosts.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-border bg-card p-4 shadow-sm">
        <h2 className="font-heading text-lg font-extrabold text-navy">Garçom só entra no pesqueiro</h2>
        <p className="mt-1 text-sm text-text-muted">
          {isConfigured
            ? 'Garçons só conseguem entrar e usar o sistema vindo das redes abaixo. Administradores acessam de qualquer lugar.'
            : 'Nenhuma rede cadastrada, então a trava está desligada e o garçom entra de qualquer lugar. Conecte este aparelho no Wi-Fi do pesqueiro e use o botão abaixo.'}
        </p>
        <p className="mt-3 text-sm text-navy">
          IP que o servidor enxerga agora: <strong>{network.yourIp || 'desconhecido'}</strong>
        </p>
        <Button className="mt-3" onClick={handleUseCurrentIp}>
          Usar a rede em que estou como a do pesqueiro
        </Button>
      </div>

      <div className="rounded-card border border-border bg-card p-4 shadow-sm">
        <h3 className="font-heading text-base font-extrabold text-navy">Redes liberadas</h3>
        {network.allowedIps.length === 0 && network.allowedHosts.length === 0 && (
          <p className="mt-2 text-sm text-text-muted">Nenhuma.</p>
        )}
        <ul className="mt-2 flex flex-col gap-2">
          {network.allowedIps.map((ip) => (
            <li key={ip} className="flex items-center justify-between gap-2 text-sm text-navy">
              <span className="truncate">{ip}</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleSaveNetwork(
                    network.allowedIps.filter((item) => item !== ip),
                    network.allowedHosts
                  )
                }
              >
                Remover
              </Button>
            </li>
          ))}
          {network.allowedHosts.map((host) => (
            <li key={host} className="flex items-center justify-between gap-2 text-sm text-navy">
              <span className="truncate">{host} (endereço dinâmico)</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleSaveNetwork(
                    network.allowedIps,
                    network.allowedHosts.filter((item) => item !== host)
                  )
                }
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Endereço DDNS do roteador (opcional)"
            autoCapitalize="none"
            value={hostInput}
            onChange={(e) => setHostInput(e.target.value)}
          />
          <Button
            variant="secondary"
            disabled={!hostInput.trim()}
            onClick={async () => {
              await handleSaveNetwork(network.allowedIps, [...network.allowedHosts, hostInput.trim()]);
              setHostInput('');
            }}
          >
            Adicionar
          </Button>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Use o endereço DDNS se o IP da internet do pesqueiro mudar de vez em quando.
        </p>
      </div>

      <div className="rounded-card border border-border bg-card p-4 shadow-sm">
        <h3 className="font-heading text-base font-extrabold text-navy">Internet do pesqueiro caiu?</h3>
        <p className="mt-1 text-sm text-text-muted">
          {bypassActive
            ? `Acesso externo liberado até ${DateTime.fromISO(network.bypassUntil as string).toFormat('HH:mm')}.`
            : 'Libere o acesso dos garçons de qualquer rede por um tempo e a trava volta sozinha.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleBypass(60)}>
            Liberar por 1 hora
          </Button>
          <Button variant="secondary" onClick={() => handleBypass(120)}>
            Liberar por 2 horas
          </Button>
          {bypassActive && <Button onClick={() => handleBypass(0)}>Reativar a trava agora</Button>}
        </div>
      </div>
    </div>
  );
};

export const UsersLayout = ({
  users,
  isLoading,
  network,
  devicesByUser,
  handleCreate,
  handleUpdate,
  handleLoadDevices,
  handleRevokeDevice,
  handleUseCurrentIp,
  handleSaveNetwork,
  handleBypass,
}: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <UserCog className="h-6 w-6 text-navy" />
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Equipe e Acessos</h1>
      </div>

      <Tabs defaultValue="team">
        <TabsList>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="network">Rede do pesqueiro</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="flex flex-col gap-4">
          <NewUserForm handleCreate={handleCreate} />

          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          )}

          {!isLoading && users.length === 0 && (
            <p className="text-sm text-text-muted">
              Nenhum usuário cadastrado ainda. Quem entra com a chave de acesso continua funcionando.
            </p>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                devices={devicesByUser[user._id]}
                handleUpdate={handleUpdate}
                handleLoadDevices={handleLoadDevices}
                handleRevokeDevice={handleRevokeDevice}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network">
          <NetworkPanel
            network={network}
            handleUseCurrentIp={handleUseCurrentIp}
            handleSaveNetwork={handleSaveNetwork}
            handleBypass={handleBypass}
          />
        </TabsContent>
      </Tabs>
    </div>
  </AppShell>
);
