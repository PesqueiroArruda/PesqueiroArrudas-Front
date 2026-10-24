import { FormEvent, ReactNode, useState } from 'react';
import { CloudSun, Loader2, Trash2 } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { WeatherIcon } from 'components/WeatherIcon';
import {
  ForecastAccuracy,
  ForecastDay,
  ForecastEvent,
  ForecastResponse,
} from 'types/Forecast';
import { parseToBRL } from 'utils/parseToBRL';
import {
  comandasText,
  dayLabel,
  formatPercent,
  formatRain,
  formatTemp,
  isUsuallyClosed,
  isWeekend,
  parseDay,
  weatherLabel,
} from 'utils/forecastDisplay';

interface Props {
  forecast: ForecastResponse | null;
  accuracy: ForecastAccuracy | null;
  events: ForecastEvent[];
  isLoading: boolean;
  hasFailed: boolean;
  onCreateEvent: (event: Omit<ForecastEvent, '_id'>) => Promise<boolean>;
  onDeleteEvent: (id: string) => void;
}

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

const compactBRL = (value: number) =>
  value >= 1000
    ? `R$ ${(value / 1000).toFixed(1).replace('.', ',')} mil`
    : `R$ ${value}`;

const confidenceVariant = {
  alta: 'success',
  média: 'gold',
  baixa: 'outline',
} as const;

const Chart = ({ days }: { days: ForecastDay[] }) => {
  const max = Math.max(...days.map((d) => d.revenue?.high ?? 0), 1);
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {days.map((day) => {
        const revenue = day.revenue ?? { expected: 0, low: 0, high: 0 };
        const closed = isUsuallyClosed(day);
        const rain = formatRain(day);
        return (
          <div
            key={day.date}
            className="flex min-w-12 flex-1 flex-col items-center gap-1"
          >
            <span className="text-[10px] font-semibold text-text-muted">
              {rain ? `${rain}` : ''}
            </span>
            <div className="relative h-40 w-full">
              {!closed && (
                <>
                  <div
                    className="absolute inset-x-1 rounded-sm bg-gold/25"
                    style={{
                      bottom: `${(revenue.low / max) * 100}%`,
                      height: `${((revenue.high - revenue.low) / max) * 100}%`,
                    }}
                  />
                  <div
                    className={`absolute inset-x-2 bottom-0 rounded-t-sm ${
                      isWeekend(day) ? 'bg-gold-strong' : 'bg-navy'
                    }`}
                    style={{ height: `${(revenue.expected / max) * 100}%` }}
                    title={`${parseToBRL(revenue.expected)} (${parseToBRL(
                      revenue.low
                    )} a ${parseToBRL(revenue.high)})`}
                  />
                </>
              )}
            </div>
            <span className="text-[10px] font-bold text-navy">
              {closed ? 'fechado' : compactBRL(revenue.expected)}
            </span>
            <span
              className={`text-[11px] font-extrabold capitalize ${
                isWeekend(day) ? 'text-gold-strong' : 'text-text-muted'
              }`}
            >
              {parseDay(day.date).toFormat('ccc dd').replace('.', '')}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DaysTable = ({ days }: { days: ForecastDay[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Dia</TableHead>
        <TableHead>Clima</TableHead>
        <TableHead>Comandas</TableHead>
        <TableHead>Faturamento</TableHead>
        <TableHead>Confiança</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {days.map((day) => (
        <TableRow
          key={day.date}
          className={isWeekend(day) ? 'bg-gold/5' : undefined}
        >
          <TableCell className="whitespace-nowrap font-bold capitalize text-navy">
            {dayLabel(day.date)}
            <div className="flex flex-wrap gap-1">
              {day.holiday && <Badge variant="cyan">{day.holiday}</Badge>}
              {day.events.map((event) => (
                <Badge key={event._id} variant="gold">
                  {event.name} ({event.effectPercent > 0 ? '+' : ''}
                  {event.effectPercent}%)
                </Badge>
              ))}
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap">
            <span className="flex items-center gap-2">
              <WeatherIcon
                code={day.weather?.weatherCode ?? null}
                className="h-5 w-5 text-gold-strong"
              />
              <span>
                {formatTemp(day.weather?.tempMax ?? null)} /{' '}
                {formatTemp(day.weather?.tempMin ?? null)}
                <span className="block text-xs text-text-muted">
                  {weatherLabel(day.weather?.weatherCode ?? null)}
                  {formatRain(day) ? ` · chuva ${formatRain(day)}` : ''}
                </span>
              </span>
            </span>
          </TableCell>
          {isUsuallyClosed(day) ? (
            <TableCell colSpan={3} className="text-text-muted">
              Costuma ficar fechado neste dia da semana.
            </TableCell>
          ) : (
            <>
              <TableCell className="whitespace-nowrap">
                {comandasText(day)}
                {day.people !== null && (
                  <span className="block text-xs text-text-muted">
                    cerca de {day.people} pessoas
                  </span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <strong>{parseToBRL(day.revenue?.expected ?? 0)}</strong>
                <span className="block text-xs text-text-muted">
                  {parseToBRL(day.revenue?.low ?? 0)} a{' '}
                  {parseToBRL(day.revenue?.high ?? 0)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={confidenceVariant[day.confidence]}>
                  {day.confidence}
                </Badge>
              </TableCell>
            </>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const SuppliesTable = ({ forecast }: { forecast: ForecastResponse }) => {
  const supplies = forecast.supplies ?? [];
  const days = forecast.days.slice(0, 7);
  if (!supplies.length) {
    return (
      <span className="text-sm text-text-muted">
        Sem vendas suficientes para estimar insumos.
      </span>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          {days.map((day) => (
            <TableHead
              key={day.date}
              className={`text-center capitalize ${
                isWeekend(day) ? 'text-gold-strong' : ''
              }`}
            >
              {parseDay(day.date).toFormat('ccc').replace('.', '')}
            </TableHead>
          ))}
          <TableHead className="text-center">7 dias</TableHead>
          <TableHead className="text-center">Estoque</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplies.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="min-w-40 font-semibold text-navy">
              {item.name}
              {item.mayRunOut && (
                <Badge variant="destructive" className="ml-2">
                  pode faltar
                </Badge>
              )}
            </TableCell>
            {days.map((day) => {
              const entry = item.perDay.find((p) => p.date === day.date);
              return (
                <TableCell key={day.date} className="text-center">
                  {entry && !isUsuallyClosed(day) ? entry.expected : '-'}
                </TableCell>
              );
            })}
            <TableCell className="text-center font-bold">
              {item.perDay
                .slice(0, 7)
                .reduce(
                  (sum, p, i) =>
                    sum + (isUsuallyClosed(days[i]) ? 0 : p.expected),
                  0
                )}
            </TableCell>
            <TableCell className="text-center">
              {item.stock ?? 'sem controle'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EventsSection = ({
  events,
  onCreateEvent,
  onDeleteEvent,
}: Pick<Props, 'events' | 'onCreateEvent' | 'onDeleteEvent'>) => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [effect, setEffect] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date || !name.trim() || effect === '') return;
    const saved = await onCreateEvent({
      date,
      name: name.trim(),
      effectPercent: Number(effect),
    });
    if (saved) {
      setDate('');
      setName('');
      setEffect('');
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="grid gap-2 sm:grid-cols-[10rem_1fr_9rem_auto]"
      >
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Data do evento"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: campeonato de pesca"
          aria-label="Nome do evento"
        />
        <Input
          type="number"
          inputMode="numeric"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="Efeito em %, ex.: 30"
          aria-label="Efeito esperado em porcentagem"
        />
        <Button type="submit">Adicionar</Button>
      </form>
      {events.length === 0 ? (
        <span className="text-sm text-text-muted">Nenhum evento marcado.</span>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {events.map((event) => (
            <li
              key={event._id}
              className="flex items-center justify-between gap-2 rounded-card bg-card px-3 py-2 text-sm"
            >
              <span>
                <strong className="capitalize">{dayLabel(event.date)}</strong> ·{' '}
                {event.name} · {event.effectPercent > 0 ? '+' : ''}
                {event.effectPercent}%
              </span>
              <button
                type="button"
                onClick={() => onDeleteEvent(event._id)}
                className="text-destructive"
                aria-label={`Remover ${event.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AccuracySection = ({ accuracy }: { accuracy: ForecastAccuracy }) => {
  const { summary, rows } = accuracy;
  if (summary.compared === 0) {
    return (
      <span className="text-sm text-text-muted">
        Ainda não há previsões salvas para comparar. O sistema guarda a previsão
        todo dia de manhã; a primeira comparação aparece depois que um dia
        previsto fechar o caixa.
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-navy">
        Nos últimos {summary.compared} dias comparados, a previsão de comandas
        errou em média{' '}
        <strong>{formatPercent(summary.comandasMeanAbsPctError)}</strong> e o
        faturamento{' '}
        <strong>{formatPercent(summary.revenueMeanAbsPctError)}</strong>. O
        movimento real caiu dentro da faixa prevista em{' '}
        <strong>{formatPercent(summary.comandasInsideRange)}</strong> dos dias.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dia</TableHead>
            <TableHead>Comandas (previsto / real)</TableHead>
            <TableHead>Faturamento (previsto / real)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows
            .filter((row) => row.actual)
            .map((row) => (
              <TableRow key={row.date}>
                <TableCell className="whitespace-nowrap font-bold capitalize text-navy">
                  {dayLabel(row.date)}
                </TableCell>
                <TableCell>
                  {row.predicted.comandas.expected} / {row.actual?.comandas}
                </TableCell>
                <TableCell>
                  {parseToBRL(row.predicted.revenue.expected)} /{' '}
                  {parseToBRL(row.actual?.revenue ?? 0)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ForecastLayout = ({
  forecast,
  accuracy,
  events,
  isLoading,
  hasFailed,
  onCreateEvent,
  onDeleteEvent,
}: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (hasFailed || !forecast) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-center text-sm text-text-muted">
          Não consegui carregar a previsão agora.
        </p>
        <Button onClick={() => window.location.reload()}>Tentar de novo</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <CloudSun className="h-6 w-6 text-navy" />
          <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
            Previsão de movimento e vendas
          </h1>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          Calculada com {forecast.historyDays} dias de caixa fechado e a
          previsão do tempo de {forecast.location}. A faixa clara no gráfico é
          onde o dia costuma cair; fora dela é exceção.
        </p>
        {!forecast.weatherAvailable && (
          <p className="mt-1 text-sm font-semibold text-destructive">
            A previsão do tempo está fora do ar. Os números abaixo usam só o
            histórico de vendas.
          </p>
        )}
      </div>

      <SectionCard
        title="Faturamento esperado nos próximos 14 dias"
        hint="Sábado e domingo em dourado. Acima de cada barra, a chance de chuva."
      >
        <Chart days={forecast.days} />
      </SectionCard>

      <SectionCard title="Dia a dia">
        <DaysTable days={forecast.days} />
      </SectionCard>

      <SectionCard
        title="Insumos dos próximos 7 dias"
        hint="Quantidade por comanda de cada item (média dos mesmos dias da semana) vezes as comandas previstas. Entram os itens mais vendidos dos últimos 6 meses."
      >
        <SuppliesTable forecast={forecast} />
      </SectionCard>

      <SectionCard
        title="Eventos e promoções"
        hint="Marque festa, campeonato ou promoção com o efeito esperado no movimento. Ele entra na previsão do dia."
      >
        <EventsSection
          events={events}
          onCreateEvent={onCreateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </SectionCard>

      <SectionCard
        title="Previsto x realizado"
        hint="Última previsão feita antes de cada dia, comparada com o caixa fechado."
      >
        {accuracy ? (
          <AccuracySection accuracy={accuracy} />
        ) : (
          <span className="text-sm text-text-muted">
            Sem dados de comparação.
          </span>
        )}
      </SectionCard>
    </div>
  );
};
