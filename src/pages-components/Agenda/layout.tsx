import { FormEvent, ReactNode, useState } from 'react';
import { CalendarDays, Loader2, Pencil, Trash2 } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  ForecastEvent,
  ForecastEventInput,
  ForecastEventResults,
  MovementLevel,
} from 'types/Forecast';
import { dayLabel, formatSigned, todayIso } from 'utils/forecastDisplay';

interface Props {
  events: ForecastEvent[];
  results: ForecastEventResults | null;
  isLoading: boolean;
  hasFailed: boolean;
  onSave: (
    input: ForecastEventInput,
    options: { id?: string; image: File | null }
  ) => Promise<boolean>;
  onDelete: (id: string) => void;
  onTogglePublished: (event: ForecastEvent) => void;
}

const LEVEL_LABEL: Record<MovementLevel, string> = {
  baixo: 'Baixo movimento',
  medio: 'Movimento médio',
  alto: 'Alto movimento',
};

const SELECT_CLASS =
  'flex h-10 w-full rounded-(--radius) border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const SectionCard = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-3 rounded-card border border-border bg-secondary p-4">
    <div>
      <h2 className="font-heading text-lg font-extrabold text-navy">{title}</h2>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">
    {label}
    {children}
  </label>
);

const EMPTY = {
  name: '',
  date: '',
  time: '',
  level: '' as MovementLevel | '',
  percent: '',
  published: true,
};

const EventForm = ({
  editing,
  onSave,
  onCancel,
}: {
  editing: ForecastEvent | null;
  onSave: Props['onSave'];
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(() =>
    editing
      ? {
          name: editing.name,
          date: editing.date,
          time: editing.time ?? '',
          level: (editing.movementLevel ?? '') as MovementLevel | '',
          percent:
            editing.effectPercent === null ? '' : String(editing.effectPercent),
          published: editing.published,
        }
      : EMPTY
  );
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const set = (patch: Partial<typeof EMPTY>) =>
    setForm((current) => ({ ...current, ...patch }));

  const canSave =
    form.name.trim() && form.date && (form.level !== '' || form.percent !== '');

  let submitLabel = 'Adicionar';
  if (editing) submitLabel = 'Salvar alterações';
  if (isSaving) submitLabel = 'Salvando...';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave || isSaving) return;
    setIsSaving(true);
    const saved = await onSave(
      {
        name: form.name.trim(),
        date: form.date,
        time: form.time || null,
        movementLevel: form.level || null,
        effectPercent: form.percent === '' ? null : Number(form.percent),
        published: form.published,
        imageKey: removeImage ? null : editing?.imageKey ?? null,
      },
      { id: editing?._id, image }
    );
    setIsSaving(false);
    if (saved) {
      setForm(EMPTY);
      setImage(null);
      setRemoveImage(false);
      onCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem_8rem]">
        <Field label="Título (atração ou nome do evento)">
          <Input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Ex.: Show do João e Maria"
          />
        </Field>
        <Field label="Data">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </Field>
        <Field label="Horário (opcional)">
          <Input
            type="time"
            value={form.time}
            onChange={(e) => set({ time: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Movimento esperado (só aqui no sistema)">
          <select
            className={SELECT_CLASS}
            value={form.level}
            onChange={(e) => set({ level: e.target.value as MovementLevel | '' })}
          >
            <option value="">Escolha o nível</option>
            {(Object.keys(LEVEL_LABEL) as MovementLevel[]).map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABEL[level]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ajuste manual em % (opcional, vale mais que o nível)">
          <Input
            type="number"
            inputMode="numeric"
            value={form.percent}
            onChange={(e) => set({ percent: e.target.value })}
            placeholder="Ex.: 45, ou -20 para queda"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cartaz (JPEG, PNG ou WebP)">
          <Input
            type="file"
            accept="image/webp,image/jpeg,image/png"
            onChange={(e) => {
              setImage(e.target.files?.[0] ?? null);
              setRemoveImage(false);
            }}
          />
          {editing?.imageUrl && !image && !removeImage && (
            <span className="flex items-center gap-2 text-xs">
              <img
                src={editing.imageUrl}
                alt=""
                className="h-12 w-12 rounded object-cover"
              />
              <button
                type="button"
                className="text-destructive underline"
                onClick={() => setRemoveImage(true)}
              >
                Remover cartaz
              </button>
            </span>
          )}
        </Field>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set({ published: e.target.checked })}
          />
          Confirmado: mostrar na landing page
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!canSave || isSaving}>
          {submitLabel}
        </Button>
        {editing && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

const EventRow = ({
  event,
  onEdit,
  onDelete,
  onTogglePublished,
}: {
  event: ForecastEvent;
  onEdit: (item: ForecastEvent) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (item: ForecastEvent) => void;
}) => (
  <li className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-card px-3 py-2 text-sm">
    <span className="flex items-center gap-3">
      {event.imageUrl && (
        <img src={event.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
      )}
      <span>
        <strong className="capitalize">{dayLabel(event.date)}</strong>
        {event.time ? ` às ${event.time}` : ''} · {event.name}
        <span className="mt-0.5 flex flex-wrap gap-1">
          {event.movementLevel && (
            <Badge variant="gold">{LEVEL_LABEL[event.movementLevel]}</Badge>
          )}
          {event.effectPercent !== null && (
            <Badge variant="outline">ajuste {formatSigned(event.effectPercent)}</Badge>
          )}
          <Badge variant={event.published ? 'success' : 'outline'}>
            {event.published ? 'na landing page' : 'rascunho'}
          </Badge>
        </span>
      </span>
    </span>
    <span className="flex items-center gap-3">
      <button
        type="button"
        className="text-xs font-semibold text-navy underline"
        onClick={() => onTogglePublished(event)}
      >
        {event.published ? 'Tirar da landing' : 'Confirmar'}
      </button>
      <button
        type="button"
        onClick={() => onEdit(event)}
        aria-label={`Editar ${event.name}`}
        className="text-navy"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Remover "${event.name}"?`)) onDelete(event._id);
        }}
        aria-label={`Remover ${event.name}`}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </span>
  </li>
);

const ResultsSection = ({ results }: { results: ForecastEventResults }) => {
  if (results.rows.length === 0) {
    return (
      <span className="text-sm text-text-muted">
        Ainda não há evento passado com caixa fechado para medir.
      </span>
    );
  }
  const levels = Object.keys(results.byLevel) as MovementLevel[];
  return (
    <div className="flex flex-col gap-3">
      {levels.length > 0 && (
        <ul className="grid gap-1.5 sm:grid-cols-3">
          {levels.map((level) => (
            <li
              key={level}
              className="flex items-center justify-between rounded-card bg-card px-3 py-2 text-sm"
            >
              <span>
                {LEVEL_LABEL[level]}
                <span className="block text-xs text-text-muted">
                  {results.byLevel[level]?.events} evento(s), mediana
                </span>
              </span>
              <strong className="text-navy">
                {formatSigned(results.byLevel[level]?.medianPct ?? 0)}
              </strong>
            </li>
          ))}
        </ul>
      )}
      <ul className="flex flex-col gap-1.5">
        {results.rows.map((row) => (
          <li
            key={row._id}
            className="flex items-center justify-between gap-2 rounded-card bg-card px-3 py-2 text-sm"
          >
            <span>
              <strong className="capitalize">{dayLabel(row.date)}</strong> ·{' '}
              {row.name}
            </span>
            <span className="whitespace-nowrap text-xs">
              {row.sharedDay ? 'dia com mais de um evento · ' : ''}
              previsto {formatSigned(row.expectedPct)} · caixa{' '}
              <strong className="text-navy">{formatSigned(row.realPct)}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AgendaLayout = ({
  events,
  results,
  isLoading,
  hasFailed,
  onSave,
  onDelete,
  onTogglePublished,
}: Props) => {
  const [editing, setEditing] = useState<ForecastEvent | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (hasFailed) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-center text-sm text-text-muted">
          Não consegui carregar a agenda agora.
        </p>
        <Button onClick={() => window.location.reload()}>Tentar de novo</Button>
      </div>
    );
  }

  const today = todayIso();
  const upcoming = events.filter((event) => event.date >= today);
  const past = events.filter((event) => event.date < today).reverse();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-navy" />
          <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
            Agenda de shows e eventos
          </h1>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          Os eventos confirmados aparecem na landing page com título, data,
          horário e cartaz. O nível de movimento fica só aqui e entra na
          previsão de vendas do dia.
        </p>
      </div>

      <SectionCard title={editing ? 'Editar evento' : 'Novo evento'}>
        <EventForm
          key={editing?._id ?? 'new'}
          editing={editing}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      </SectionCard>

      <SectionCard title="Próximos eventos">
        {upcoming.length === 0 ? (
          <span className="text-sm text-text-muted">Nenhum evento marcado.</span>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {upcoming.map((event) => (
              <EventRow
                key={event._id}
                event={event}
                onEdit={setEditing}
                onDelete={onDelete}
                onTogglePublished={onTogglePublished}
              />
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Resultado dos eventos passados"
        hint="Quanto o faturamento do dia ficou acima da base do mesmo dia da semana. Serve pra ajustar os percentuais de cada nível; não muda a previsão sozinho. Clima e feriado próximos podem misturar no número."
      >
        {results ? (
          <ResultsSection results={results} />
        ) : (
          <span className="text-sm text-text-muted">
            Não consegui medir os eventos agora.
          </span>
        )}
      </SectionCard>

      {past.length > 0 && (
        <SectionCard title="Eventos passados">
          <ul className="flex flex-col gap-1.5">
            {past.map((event) => (
              <EventRow
                key={event._id}
                event={event}
                onEdit={setEditing}
                onDelete={onDelete}
                onTogglePublished={onTogglePublished}
              />
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
};
