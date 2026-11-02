import { serverApi } from 'services/serverApi';
import { ForecastAccuracy, ForecastResponse } from 'types/Forecast';

class ForecastService {
  async getSummary(days = 7): Promise<ForecastResponse> {
    const { data } = await serverApi.get('/forecast/summary', {
      params: { days },
    });
    return data;
  }

  async getDetail(days = 14): Promise<ForecastResponse> {
    const { data } = await serverApi.get('/forecast/detail', {
      params: { days },
    });
    return data;
  }

  async getAccuracy(days = 28): Promise<ForecastAccuracy> {
    const { data } = await serverApi.get('/forecast/accuracy', {
      params: { days },
    });
    return data;
  }
}

export default new ForecastService();
