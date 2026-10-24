import Link from 'next/link';
import { CloudRain, Loader2, Users } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { WeatherIcon } from 'components/WeatherIcon';
import { ForecastDay, ForecastResponse } from 'types/Forecast';
import {
  dayLabel,
  formatRain,
  formatTemp,
  isUsuallyClosed,
  isWeekend,
  weatherLabel,
  weekdayName,
} from 'utils/forecastDisplay';

interface Props {
  forecast: ForecastResponse | null;
  isLoading: boolean;
  hasFailed: boolean;
}

const levelVariant = {
  baixo: 'default',
  médio: 'gold',
  alto: 'success',
} as const;

const Movement = ({ day }: { day: ForecastDay }) => {
  if (isUsuallyClosed(day)) {
    return (
      <span className="text-sm font-semibold text-text-muted">
        Costuma ficar fechado
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        {day.level && (
          <Badge variant={levelVariant[day.level]}>Movimento {day.level}</Badge>
        )}
        {day.confidence === 'baixa' && (
          <Badge variant="outline">Estimativa incerta</Badge>
        )}
      </div>
      <p className="text-sm text-navy">
        Entre <strong>{day.comandas.low}</strong> e{' '}
        <strong>{day.comandas.high}</strong> comandas
      </p>
      {day.people !== null && (
        <p className="flex items-center gap-1 text-xs text-text-muted">
          <Users className="h-3.5 w-3.5" /> cerca de {day.people} pessoas
        </p>
      )}
    </div>
  );
};

const Tags = ({ day }: { day: ForecastDay }) => (
  <>
    {day.holiday && <Badge variant="cyan">{day.holiday}</Badge>}
    {day.events.map((event) => (
      <Badge key={event._id} variant="gold">
        {event.name}
      </Badge>
    ))}
  </>
);

const WeekendCard = ({ day }: { day: ForecastDay }) => {
  const rain = formatRain(day);
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-card border border-gold/40 bg-secondary p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading text-lg font-extrabold capitalize text-navy">
            {weekdayName(day.date)}
          </p>
          <p className="text-xs font-semibold text-text-muted">
            {dayLabel(day.date)}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          <Tags day={day} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <WeatherIcon
          code={day.weather?.weatherCode ?? null}
          className="h-10 w-10 text-gold-strong"
        />
        <div>
          <p className="font-heading text-2xl font-extrabold text-navy">
            {formatTemp(day.weather?.tempMax ?? null)}
            <span className="ml-1 text-base font-bold text-text-muted">
              / {formatTemp(day.weather?.tempMin ?? null)}
            </span>
          </p>
          <p className="flex items-center gap-1 text-sm font-semibold text-navy">
            <CloudRain className="h-4 w-4" />
            {rain ? `${rain} de chance de chuva` : 'Chuva sem previsão'}
          </p>
        </div>
      </div>

      <Movement day={day} />
    </div>
  );
};

const DayCard = ({ day }: { day: ForecastDay }) => {
  const rain = formatRain(day);
  return (
    <div className="flex min-w-36 flex-col gap-2 rounded-card border border-border bg-card p-3 shadow-sm">
      <p className="text-sm font-extrabold capitalize text-navy">
        {dayLabel(day.date)}
      </p>
      <div className="flex items-center gap-2">
        <WeatherIcon
          code={day.weather?.weatherCode ?? null}
          className="h-6 w-6 text-gold-strong"
        />
        <span className="text-sm font-bold text-navy">
          {formatTemp(day.weather?.tempMax ?? null)} /{' '}
          {formatTemp(day.weather?.tempMin ?? null)}
        </span>
      </div>
      <p className="text-xs text-text-muted">
        {rain
          ? `Chuva ${rain}`
          : weatherLabel(day.weather?.weatherCode ?? null)}
      </p>
      {isUsuallyClosed(day) ? (
        <p className="text-xs font-semibold text-text-muted">Costuma fechar</p>
      ) : (
        <p className="text-xs text-navy">
          {day.level ? `Movimento ${day.level}` : 'Movimento'} ·{' '}
          {day.comandas.low} a {day.comandas.high} comandas
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        <Tags day={day} />
      </div>
    </div>
  );
};

export const ForecastCardLayout = ({
  forecast,
  isLoading,
  hasFailed,
}: Props) => {
  const days = forecast?.days ?? [];
  const weekend = days.filter(isWeekend).slice(0, 2);
  const others = days.filter((day) => !weekend.includes(day));

  return (
    <section className="mb-6 flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-extrabold text-navy">
            Próximos dias
          </h2>
          <p className="text-xs text-text-muted">
            Clima de {forecast?.location ?? 'Santana de Parnaíba'} e movimento
            esperado, com base nas vendas dos últimos anos.
          </p>
        </div>
        <Link
          href="/forecast"
          className="text-sm font-bold text-gold-strong hover:underline"
        >
          Ver detalhes
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      )}

      {hasFailed && !isLoading && (
        <p className="text-sm text-text-muted">
          Não consegui carregar a previsão agora.{' '}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-bold text-gold-strong hover:underline"
          >
            Tentar de novo
          </button>
        </p>
      )}

      {!isLoading && !hasFailed && days.length === 0 && (
        <p className="text-sm text-text-muted">
          Ainda não há vendas suficientes para prever.
        </p>
      )}

      {weekend.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {weekend.map((day) => (
            <WeekendCard key={day.date} day={day} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {others.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      )}

      {forecast && !forecast.weatherAvailable && (
        <p className="text-xs text-text-muted">
          A previsão do tempo está fora do ar. Os números abaixo usam só o
          histórico de vendas.
        </p>
      )}
    </section>
  );
};
