import { useEffect, useState } from 'react';

import ForecastService from 'pages-components/Forecast/services/ForecastService';
import { ForecastResponse } from 'types/Forecast';
import { ForecastCardLayout } from './layout';

export const ForecastCard = () => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const data = await ForecastService.getSummary(7);
        if (isActive) setForecast(data);
      } catch {
        if (isActive) setHasFailed(true);
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <ForecastCardLayout
      forecast={forecast}
      isLoading={isLoading}
      hasFailed={hasFailed}
    />
  );
};
