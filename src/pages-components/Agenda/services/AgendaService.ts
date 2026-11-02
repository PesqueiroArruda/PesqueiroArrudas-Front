import { serverApi } from 'services/serverApi';
import {
  ForecastEvent,
  ForecastEventInput,
  ForecastEventResults,
} from 'types/Forecast';

// Pede desde antes do primeiro caixa para vir também os eventos passados.
const FROM_ALL = '2022-01-01';

class AgendaService {
  async getEvents(): Promise<ForecastEvent[]> {
    const { data } = await serverApi.get('/forecast/events', {
      params: { from: FROM_ALL },
    });
    return data;
  }

  async getResults(): Promise<ForecastEventResults> {
    const { data } = await serverApi.get('/forecast/events/results');
    return data;
  }

  async createEvent(event: ForecastEventInput): Promise<ForecastEvent> {
    const { data } = await serverApi.post('/forecast/events', event);
    return data;
  }

  async updateEvent(
    id: string,
    event: ForecastEventInput
  ): Promise<ForecastEvent> {
    const { data } = await serverApi.put(`/forecast/events/${id}`, event);
    return data;
  }

  async deleteEvent(id: string) {
    const { data } = await serverApi.delete(`/forecast/events/${id}`);
    return data;
  }

  async getImageUploadUrl(
    contentType: string
  ): Promise<{ uploadUrl: string; imageKey: string }> {
    const { data } = await serverApi.post('/forecast/events/upload-url', {
      contentType,
    });
    return data;
  }
}

export default new AgendaService();
