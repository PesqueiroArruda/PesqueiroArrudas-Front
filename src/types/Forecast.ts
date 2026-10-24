export interface ForecastRange {
  expected: number;
  low: number;
  high: number;
}

export interface ForecastWeather {
  tempMax: number | null;
  tempMin: number | null;
  precipitationProbability: number | null;
  precipitationSum: number | null;
  weatherCode: number | null;
}

export interface ForecastEventSummary {
  _id: string;
  name: string;
  effectPercent: number;
}

export interface ForecastDay {
  date: string;
  weekday: number;
  likelyClosed: boolean;
  comandas: ForecastRange;
  // Só vem na versão de detalhe (admin).
  revenue?: ForecastRange;
  level: 'baixo' | 'médio' | 'alto' | null;
  confidence: 'alta' | 'média' | 'baixa';
  people: number | null;
  weather: ForecastWeather | null;
  holiday: string | null;
  events: ForecastEventSummary[];
}

export interface ForecastSupply {
  name: string;
  perDay: { date: string; expected: number; low: number; high: number }[];
  totalExpected: number;
  totalHigh: number;
  stock: number | null;
  mayRunOut: boolean;
}

export interface ForecastResponse {
  generatedAt: string;
  location: string;
  weatherAvailable: boolean;
  historyDays: number;
  peoplePerCommand: number | null;
  days: ForecastDay[];
  supplies?: ForecastSupply[];
}

export interface ForecastEvent {
  _id: string;
  date: string;
  name: string;
  effectPercent: number;
}

export interface ForecastAccuracyRow {
  date: string;
  generatedDate: string;
  predicted: { comandas: ForecastRange; revenue: ForecastRange };
  actual: { comandas: number; revenue: number } | null;
}

export interface ForecastAccuracy {
  rows: ForecastAccuracyRow[];
  summary: {
    compared: number;
    comandasMeanAbsPctError: number | null;
    revenueMeanAbsPctError: number | null;
    comandasInsideRange: number | null;
  };
}
