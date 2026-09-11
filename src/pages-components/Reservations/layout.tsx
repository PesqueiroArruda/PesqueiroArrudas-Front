import { useState } from 'react';
import { DateTime } from 'luxon';
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Inbox,
  List,
  Loader2,
  ReceiptText,
  Users,
} from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { ReservationPaymentStatusBadge } from 'components/ReservationPaymentStatusBadge';
import { ReservationOperationalStatusBadge } from 'components/ReservationOperationalStatusBadge';
import { Reservation, ReservationFilters, ReservationOperationalStatus } from 'types/Reservation';
import { cn } from 'lib/utils';
import { parseToBRL } from 'utils/parseToBRL';
import { getReservationDatePreset, ReservationDatePresetKey } from 'utils/getReservationDatePreset';

interface Props {
  reservations: Reservation[];
  isLoading: boolean;
  filters: ReservationFilters;
  conflictIds: Set<string>;
  selectedReservation: Reservation | null;
  updatingId: string | null;
  handleFilterChange: (patch: Partial<ReservationFilters>) => void;
  handleOpenDetail: (reservation: Reservation) => void;
  handleCloseDetail: () => void;
  handleChangeOperationalStatus: (id: string, status: ReservationOperationalStatus) => void;
  handleOpenCommandModal: (reservation: Reservation) => void;
}

const OPERATIONAL_STATUS_OPTIONS: { value: ReservationOperationalStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'compareceu', label: 'Compareceu' },
  { value: 'nao_compareceu', label: 'Não compareceu' },
  { value: 'cancelada_cliente', label: 'Cancelado pelo cliente' },
];

const ENVIRONMENT_LABEL: Record<Reservation['environment'], string> = {
  interno: 'Interno',
  externo: 'Externo',
};

function formatDate(isoDate: string) {
  return DateTime.fromISO(isoDate).setLocale('pt-BR').toLocaleString(DateTime.DATE_MED);
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function canOpenCommand(reservation: Reservation) {
  return reservation.paymentStatus === 'paid' && reservation.reservationDate === DateTime.now().toISODate();
}

interface OpenCommandButtonProps {
  reservation: Reservation;
  onOpen: (reservation: Reservation) => void;
}

const OpenCommandButton = ({ reservation, onOpen }: OpenCommandButtonProps) => {
  if (!canOpenCommand(reservation)) return null;

  return (
    <Button variant="ghost" size="sm" onClick={() => onOpen(reservation)}>
      <ReceiptText className="h-3.5 w-3.5" /> Abrir comanda
    </Button>
  );
};

interface OperationalStatusMenuProps {
  reservation: Reservation;
  isUpdating: boolean;
  onChange: (status: ReservationOperationalStatus) => void;
}

const OperationalStatusMenu = ({ reservation, isUpdating, onChange }: OperationalStatusMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        disabled={isUpdating}
        className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ReservationOperationalStatusBadge status={reservation.operationalStatus} />
        {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      {OPERATIONAL_STATUS_OPTIONS.map((option) => (
        <DropdownMenuItem key={option.value} onSelect={() => onChange(option.value)}>
          {option.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const DATE_PRESET_OPTIONS: { value: ReservationDatePresetKey; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'next7days', label: 'Próximos 7 dias' },
  { value: 'thisMonth', label: 'Este mês' },
];

export const ReservationsLayout = ({
  reservations,
  isLoading,
  filters,
  conflictIds,
  selectedReservation,
  updatingId,
  handleFilterChange,
  handleOpenDetail,
  handleCloseDetail,
  handleChangeOperationalStatus,
  handleOpenCommandModal,
}: Props) => {
  const [viewMode, setViewMode] = useState<'list' | 'byDay'>('list');
  const [datePreset, setDatePreset] = useState<ReservationDatePresetKey | 'custom'>('custom');

  function handleDatePresetChange(value: string) {
    if (value === 'custom') {
      setDatePreset('custom');
      return;
    }
    const preset = value as ReservationDatePresetKey;
    setDatePreset(preset);
    handleFilterChange(getReservationDatePreset(preset));
  }

  function renderRow(reservation: Reservation) {
    const hasConflict = conflictIds.has(reservation.id);

    return (
      <TableRow
        key={reservation.id}
        className={cn('cursor-pointer', hasConflict && 'bg-destructive/10 hover:bg-destructive/20')}
        onClick={() => handleOpenDetail(reservation)}
      >
        <TableCell>
          <div className="flex items-center gap-1.5">
            {hasConflict && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
            {formatDate(reservation.reservationDate)}
          </div>
        </TableCell>
        <TableCell>{formatTime(reservation.reservationTime)}</TableCell>
        <TableCell className="font-semibold">{reservation.customerName}</TableCell>
        <TableCell>{reservation.customerPhone}</TableCell>
        <TableCell>{reservation.partySize}</TableCell>
        <TableCell>{ENVIRONMENT_LABEL[reservation.environment]}</TableCell>
        <TableCell>
          <ReservationPaymentStatusBadge status={reservation.paymentStatus} />
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <OperationalStatusMenu
            reservation={reservation}
            isUpdating={updatingId === reservation.id}
            onChange={(status) => handleChangeOperationalStatus(reservation.id, status)}
          />
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <OpenCommandButton reservation={reservation} onOpen={handleOpenCommandModal} />
        </TableCell>
      </TableRow>
    );
  }

  const reservationsByDay = reservations.reduce<Record<string, Reservation[]>>((acc, reservation) => {
    acc[reservation.reservationDate] = acc[reservation.reservationDate] || [];
    acc[reservation.reservationDate].push(reservation);
    return acc;
  }, {});
  const sortedDays = Object.keys(reservationsByDay).sort();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <CalendarDays className="h-6 w-6 text-navy" />
            <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Reservas</h1>
          </div>
          <div className="flex items-center gap-1 rounded-(--radius) border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 rounded-(--radius-sm) px-3 py-1.5 text-sm font-bold',
                viewMode === 'list' ? 'bg-secondary text-navy' : 'text-text-muted',
              )}
            >
              <List className="h-4 w-4" /> Lista
            </button>
            <button
              type="button"
              onClick={() => setViewMode('byDay')}
              className={cn(
                'flex items-center gap-1.5 rounded-(--radius-sm) px-3 py-1.5 text-sm font-bold',
                viewMode === 'byDay' ? 'bg-secondary text-navy' : 'text-text-muted',
              )}
            >
              <CalendarDays className="h-4 w-4" /> Por dia
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-3 sm:p-4">
          <Input
            placeholder="Buscar por nome ou telefone"
            value={filters.q || ''}
            onChange={(e) => handleFilterChange({ q: e.target.value })}
          />

          <Tabs value={datePreset} onValueChange={handleDatePresetChange}>
            <TabsList>
              {DATE_PRESET_OPTIONS.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
            </TabsList>
          </Tabs>

          {datePreset === 'custom' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-muted">De</span>
                <Input
                  type="date"
                  value={filters.from || ''}
                  onChange={(e) => handleFilterChange({ from: e.target.value || undefined })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-muted">Até</span>
                <Input
                  type="date"
                  value={filters.to || ''}
                  onChange={(e) => handleFilterChange({ to: e.target.value || undefined })}
                />
              </div>
            </div>
          )}

          <Tabs
            value={filters.paymentStatus || 'all'}
            onValueChange={(value) => handleFilterChange({ paymentStatus: value === 'all' ? undefined : value })}
          >
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendente</TabsTrigger>
              <TabsTrigger value="paid">Pago</TabsTrigger>
              <TabsTrigger value="failed">Falhou</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={filters.environment || 'all'}
            onValueChange={(value) => handleFilterChange({ environment: value === 'all' ? undefined : value })}
          >
            <TabsList>
              <TabsTrigger value="all">Todos os ambientes</TabsTrigger>
              <TabsTrigger value="interno">Interno</TabsTrigger>
              <TabsTrigger value="externo">Externo</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading && reservations.length === 0 && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}

        {!isLoading && reservations.length === 0 && (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
            <Inbox className="h-6 w-6 text-navy" />
            <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
              Nenhuma reserva encontrada
            </span>
          </div>
        )}

        {reservations.length > 0 && viewMode === 'list' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Pessoas</TableHead>
                <TableHead>Ambiente</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{reservations.map(renderRow)}</TableBody>
          </Table>
        )}

        {reservations.length > 0 && viewMode === 'byDay' && (
          <div className="flex flex-col gap-5">
            {sortedDays.map((day) => (
              <div key={day} className="flex flex-col gap-2">
                <h2 className="font-heading text-base font-bold text-navy">{formatDate(day)}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Pessoas</TableHead>
                      <TableHead>Ambiente</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservationsByDay[day]
                      .slice()
                      .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime))
                      .map((reservation) => {
                        const hasConflict = conflictIds.has(reservation.id);
                        return (
                          <TableRow
                            key={reservation.id}
                            className={cn('cursor-pointer', hasConflict && 'bg-destructive/10 hover:bg-destructive/20')}
                            onClick={() => handleOpenDetail(reservation)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {hasConflict && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
                                {formatTime(reservation.reservationTime)}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{reservation.customerName}</TableCell>
                            <TableCell>{reservation.customerPhone}</TableCell>
                            <TableCell>{reservation.partySize}</TableCell>
                            <TableCell>{ENVIRONMENT_LABEL[reservation.environment]}</TableCell>
                            <TableCell>
                              <ReservationPaymentStatusBadge status={reservation.paymentStatus} />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <OperationalStatusMenu
                                reservation={reservation}
                                isUpdating={updatingId === reservation.id}
                                onChange={(status) => handleChangeOperationalStatus(reservation.id, status)}
                              />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <OpenCommandButton reservation={reservation} onOpen={handleOpenCommandModal} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent>
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReservation.customerName}</DialogTitle>
              </DialogHeader>

              {conflictIds.has(selectedReservation.id) && (
                <div className="flex items-start gap-2 rounded-(--radius) border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Existe(m) outra(s) reserva(s) paga(s) para o mesmo dia, horário e ambiente. Resolva o
                    conflito manualmente com o cliente.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-navy">
                <span className="text-text-muted">Telefone</span>
                <span className="font-semibold">{selectedReservation.customerPhone}</span>

                <span className="text-text-muted">Data</span>
                <span className="font-semibold">{formatDate(selectedReservation.reservationDate)}</span>

                <span className="text-text-muted">Hora</span>
                <span className="font-semibold">{formatTime(selectedReservation.reservationTime)}</span>

                <span className="text-text-muted">Pessoas</span>
                <span className="flex items-center gap-1 font-semibold">
                  <Users className="h-3.5 w-3.5" /> {selectedReservation.partySize}
                </span>

                <span className="text-text-muted">Ambiente</span>
                <span className="font-semibold">{ENVIRONMENT_LABEL[selectedReservation.environment]}</span>

                <span className="text-text-muted">Sinal</span>
                <span className="font-semibold">{parseToBRL(selectedReservation.depositAmountCents / 100)}</span>

                <span className="text-text-muted">Status do pagamento</span>
                <span>
                  <ReservationPaymentStatusBadge status={selectedReservation.paymentStatus} />
                </span>

                <span className="text-text-muted">Comprovante InfinitePay (NSU)</span>
                <span className="break-all font-mono text-xs">
                  {selectedReservation.infinitepayTransactionNsu || '—'}
                </span>

                <span className="text-text-muted">Slug da fatura InfinitePay</span>
                <span className="break-all font-mono text-xs">
                  {selectedReservation.infinitepayInvoiceSlug || '—'}
                </span>

                {selectedReservation.notes && (
                  <>
                    <span className="text-text-muted">Observações</span>
                    <span className="font-semibold">{selectedReservation.notes}</span>
                  </>
                )}

                <span className="text-text-muted">Criada em</span>
                <span className="font-semibold">
                  {DateTime.fromISO(selectedReservation.createdAt).setLocale('pt-BR').toLocaleString(DateTime.DATETIME_MED)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-navy">Status:</span>
                  <OperationalStatusMenu
                    reservation={selectedReservation}
                    isUpdating={updatingId === selectedReservation.id}
                    onChange={(status) => handleChangeOperationalStatus(selectedReservation.id, status)}
                  />
                </div>
                <OpenCommandButton reservation={selectedReservation} onOpen={handleOpenCommandModal} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};
