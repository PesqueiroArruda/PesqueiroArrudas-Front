import { ReactNode } from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
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
  ForecastResponse,
} from 'types/Forecast';
import { parseToBRL } from 'utils/parseToBRL';
import {
  comandasText,
  dayLabel,
  formatPercent,
  formatRain,
  formatSigned,
  formatTemp,
  isUsuallyClosed,
  isWeekend,
  parseDay,
  weatherEffectRows,
  weatherEffectText,
  weatherLabel,
} from 'utils/forecastDisplay';

interface Props {
  forecast: ForecastResponse | null;
  accuracy: ForecastAccuracy | null;
  isLoading: boolean;
  hasFailed: boolean;
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
                {weatherEffectText(day) && (
                  <span className="block text-xs font-semibold text-navy">
                    {weatherEffectText(day)}
                  </span>
                )}
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
  isLoading,
  hasFailed,
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
        {forecast.weatherAvailable && forecast.weatherLearned === false && (
          <p className="mt-1 text-sm font-semibold text-destructive">
            O histórico do tempo não carregou agora. A temperatura e a chuva dos
            próximos dias aparecem, mas ainda não mexem nos valores. Tentamos de
            novo em instantes.
          </p>
        )}
        {forecast.weatherAvailable && forecast.weatherStale && (
          <p className="mt-1 text-xs text-text-muted">
            Os serviços de clima estão instáveis. Estamos usando a última
            consulta que deu certo.
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

      {forecast.weatherEffects && forecast.weatherLearned !== false && (
        <SectionCard
          title="Quanto o clima pesa nas vendas"
          hint="Aprendido no seu histórico de caixa: diferença no faturamento em relação a um dia normal da mesma semana. 0% quer dizer que não deu pra medir diferença."
        >
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {weatherEffectRows(forecast.weatherEffects).map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between rounded-card bg-card px-3 py-2 text-sm"
              >
                <span>{row.label}</span>
                <strong className="text-navy">{formatSigned(row.pct)}</strong>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard
        title="Insumos dos próximos 7 dias"
        hint="Quantidade por comanda de cada item (média dos mesmos dias da semana) vezes as comandas previstas. Entram os itens mais vendidos dos últimos 6 meses."
      >
        <SuppliesTable forecast={forecast} />
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
