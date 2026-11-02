import { DateTime } from 'luxon';
import { ForecastDay } from 'types/Forecast';

const ZONE = 'America/Sao_Paulo';

export type WeatherKind =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'storm';

// Códigos WMO usados pelo Open-Meteo.
export function weatherKind(code: number | null): WeatherKind {
  if (code === null || code === undefined) return 'cloudy';
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 95) return 'storm';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  return 'cloudy';
}

const WEATHER_LABEL: Record<WeatherKind, string> = {
  clear: 'Céu limpo',
  partly: 'Poucas nuvens',
  cloudy: 'Nublado',
  fog: 'Neblina',
  drizzle: 'Garoa',
  rain: 'Chuva',
  storm: 'Chuva com trovoada',
};

export function weatherLabel(code: number | null) {
  return WEATHER_LABEL[weatherKind(code)];
}

export function parseDay(date: string) {
  return DateTime.fromISO(date, { zone: ZONE }).setLocale('pt-BR');
}

export function todayIso() {
  return DateTime.now().setZone(ZONE).toISODate() as string;
}

// "sáb, 24/10" ou "Hoje" / "Amanhã" quando for o caso.
export function dayLabel(date: string) {
  const dt = parseDay(date);
  const today = DateTime.now().setZone(ZONE).startOf('day');
  const diff = Math.round(dt.startOf('day').diff(today, 'days').days);
  const short = dt.toFormat('ccc, dd/LL').replace('.', '');
  if (diff === 0) return `Hoje, ${dt.toFormat('dd/LL')}`;
  if (diff === 1) return `Amanhã, ${dt.toFormat('dd/LL')}`;
  return short;
}

export function weekdayName(date: string) {
  return parseDay(date).toFormat('cccc');
}

export function isWeekend(day: Pick<ForecastDay, 'weekday'>) {
  return day.weekday === 6 || day.weekday === 7;
}

export function formatTemp(value: number | null) {
  return value === null || value === undefined ? '-' : `${Math.round(value)}°`;
}

export function formatRain(day: Pick<ForecastDay, 'weather'>) {
  const probability = day.weather?.precipitationProbability;
  if (probability === null || probability === undefined) return null;
  return `${Math.round(probability)}%`;
}

// "+8%" / "-12%" / "0%".
export function formatSigned(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`;
}

// Efeito do clima do dia no faturamento, ou null quando não mexeu.
export function weatherEffectText(day: Pick<ForecastDay, 'factors'>) {
  const pct = day.factors?.weatherPct?.revenue;
  if (!pct) return null;
  return `clima ${formatSigned(pct)} no faturamento`;
}

const RAIN_LABEL: Record<string, string> = {
  seco: 'Dia seco',
  fraca: 'Chuva fraca',
  forte: 'Chuva forte',
};
const TEMP_LABEL: Record<string, string> = {
  frio: 'Frio (máx. abaixo de 20°)',
  ameno: 'Ameno',
  quente: 'Quente (máx. a partir de 30°)',
};

export function weatherEffectRows(effects: {
  rain: Record<string, number>;
  temp: Record<string, number>;
}) {
  const rows = [
    ...Object.entries(effects.rain).map(([key, pct]) => ({
      label: RAIN_LABEL[key] ?? key,
      pct,
    })),
    ...Object.entries(effects.temp).map(([key, pct]) => ({
      label: TEMP_LABEL[key] ?? key,
      pct,
    })),
  ];
  return rows;
}

// Quando o dia costuma ficar fechado e não há feriado nem evento, não mostra número.
export function isUsuallyClosed(day: ForecastDay) {
  return day.likelyClosed && !day.holiday && day.events.length === 0;
}

export function comandasText(day: ForecastDay) {
  const { expected, low, high } = day.comandas;
  return `${expected} comandas (${low} a ${high})`;
}

export function formatPercent(value: number | null) {
  if (value === null || value === undefined) return '-';
  return `${Math.round(value * 100)}%`;
}
