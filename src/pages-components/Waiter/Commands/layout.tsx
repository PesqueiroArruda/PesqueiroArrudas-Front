import { Dispatch, SetStateAction, useState } from 'react';
import { Check, ChevronRight, Loader2, Minus, Plus } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { cn } from 'lib/utils';
import { WaiterCommand } from '../services/WaiterService';
import { WaiterShell } from '../WaiterShell';

interface Props {
  commands: WaiterCommand[];
  isLoading: boolean;
  isOutsideNetwork: boolean;
  isCreating: boolean;
  loggedUser: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  handleOpen: (id: string) => void;
  handleCreate: (payload: { table: string; fishingType: string; peopleCount: number }) => void;
}

const LOCATIONS = ['Salão', 'Deck', 'Lago'];
const FISHING_TYPES = ['Nenhum', 'Pesca Esportiva', 'Pesque Pague'];

const Chip = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={cn(
      'flex h-12 flex-1 items-center justify-center gap-1.5 rounded-(--radius) border px-3 text-sm font-bold transition-colors',
      selected
        ? 'border-gold bg-gold/10 text-navy'
        : 'border-border bg-card text-text-muted active:bg-secondary'
    )}
  >
    {selected && <Check className="h-4 w-4 text-gold-strong" />}
    {children}
  </button>
);

const NewCommandDialog = ({
  open,
  onOpenChange,
  isCreating,
  handleCreate,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isCreating: boolean;
  handleCreate: Props['handleCreate'];
}) => {
  const [table, setTable] = useState('');
  const [location, setLocation] = useState('');
  const [fishingType, setFishingType] = useState('Nenhum');
  const [peopleCount, setPeopleCount] = useState(1);

  const canSubmit = table.trim() && location && !isCreating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova comanda</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit) return;
            handleCreate({
              table: `${table.trim()} (${location})`,
              fishingType,
              peopleCount,
            });
          }}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy">Mesa ou nome</span>
            <Input
              aria-label="Mesa ou nome"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="Ex.: 12 ou Família Silva"
              className="h-12 text-base"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy">Local</span>
            <div className="flex gap-2">
              {LOCATIONS.map((item) => (
                <Chip key={item} selected={location === item} onClick={() => setLocation(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy">Tipo de pesca</span>
            <div className="flex flex-wrap gap-2">
              {FISHING_TYPES.map((item) => (
                <Chip key={item} selected={fishingType === item} onClick={() => setFishingType(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">Pessoas</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Menos uma pessoa"
                onClick={() => setPeopleCount((prev) => Math.max(1, prev - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card active:bg-secondary"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-8 text-center font-heading text-xl font-extrabold text-navy">
                {peopleCount}
              </span>
              <button
                type="button"
                aria-label="Mais uma pessoa"
                onClick={() => setPeopleCount((prev) => prev + 1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card active:bg-secondary"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 items-center justify-center gap-2 rounded-(--radius) bg-primary text-base font-bold text-primary-foreground disabled:opacity-50"
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
            Abrir comanda e adicionar itens
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const WaiterCommandsLayout = ({
  commands,
  isLoading,
  isOutsideNetwork,
  isCreating,
  loggedUser,
  search,
  setSearch,
  handleOpen,
  handleCreate,
}: Props) => {
  const [isNewOpen, setIsNewOpen] = useState(false);

  return (
    <WaiterShell title="Comandas" isOutsideNetwork={isOutsideNetwork}>
      <div className="sticky top-14 z-20 bg-background px-3 pb-2 pt-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar mesa"
          className="h-11 text-base"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3 pb-28">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}

        {!isLoading && commands.length === 0 && (
          <p className="py-16 text-center text-sm text-text-muted">
            Nenhuma comanda aberta. Toque em Nova comanda para começar.
          </p>
        )}

        {commands.map((command) => {
          const itemCount = command.products.reduce((sum, item) => sum + item.amount, 0);
          const isMine = command.waiter === loggedUser;
          return (
            <button
              key={command._id}
              type="button"
              onClick={() => handleOpen(command._id)}
              className="flex min-h-16 items-center gap-3 rounded-card border border-border bg-card p-3 text-left shadow-sm active:bg-secondary"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-heading text-base font-extrabold text-navy">
                  {command.table}
                </span>
                <span className="truncate text-xs text-text-muted">
                  {command.waiter} · {command.peopleCount || 1}{' '}
                  {(command.peopleCount || 1) === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>
              {isMine && <Badge variant="gold">Minha</Badge>}
              <Badge>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</Badge>
              <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
            </button>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          className="mx-auto flex h-14 w-full max-w-lg items-center justify-center gap-2 rounded-(--radius-md) bg-primary text-base font-bold text-primary-foreground shadow-card active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          Nova comanda
        </button>
      </div>

      <NewCommandDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        isCreating={isCreating}
        handleCreate={handleCreate}
      />
    </WaiterShell>
  );
};
