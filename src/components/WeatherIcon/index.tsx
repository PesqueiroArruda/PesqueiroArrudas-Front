import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
} from 'lucide-react';
import { weatherKind, weatherLabel } from 'utils/forecastDisplay';

interface Props {
  code: number | null;
  className?: string;
}

const ICONS = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  storm: CloudLightning,
};

export const WeatherIcon = ({ code, className }: Props) => {
  const Icon = ICONS[weatherKind(code)];
  return <Icon className={className} aria-label={weatherLabel(code)} />;
};
