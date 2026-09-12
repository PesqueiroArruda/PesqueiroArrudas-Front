import { DateTime } from 'luxon';
import { Inbox, Loader2, Users } from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Input } from 'components/ui/input';
import { Badge } from 'components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { MenuUser, MenuUserFilters } from 'types/MenuUser';

interface Props {
  menuUsers: MenuUser[];
  isLoading: boolean;
  filters: MenuUserFilters;
  handleFilterChange: (patch: Partial<MenuUserFilters>) => void;
}

function formatDateTime(iso: string) {
  return DateTime.fromISO(iso).setLocale('pt-BR').toFormat("dd/MM/yyyy 'às' HH:mm");
}

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export const MenuUsersLayout = ({ menuUsers, isLoading, filters, handleFilterChange }: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Users className="h-6 w-6 text-navy" />
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Usuários do Cardápio</h1>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-3 sm:p-4">
        <Input
          placeholder="Buscar por nome ou e-mail"
          value={filters.q || ''}
          onChange={(e) => handleFilterChange({ q: e.target.value })}
        />
      </div>

      {isLoading && menuUsers.length === 0 && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {!isLoading && menuUsers.length === 0 && (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
          <Inbox className="h-6 w-6 text-navy" />
          <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
            Nenhum usuário encontrado
          </span>
        </div>
      )}

      {menuUsers.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Aceita marketing?</TableHead>
              <TableHead>Cadastrado em</TableHead>
              <TableHead>Último acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuUsers.map((menuUser) => (
              <TableRow key={menuUser.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar>
                      <AvatarImage src={menuUser.avatarUrl || undefined} alt={menuUser.name || menuUser.email} />
                      <AvatarFallback>{initials(menuUser.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{menuUser.name || '—'}</span>
                  </div>
                </TableCell>
                <TableCell>{menuUser.email}</TableCell>
                <TableCell>
                  <Badge variant={menuUser.marketingConsent ? 'success' : 'outline'}>
                    {menuUser.marketingConsent ? 'Sim' : 'Não'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDateTime(menuUser.createdAt)}</TableCell>
                <TableCell>{formatDateTime(menuUser.lastAccessAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  </AppShell>
);
