import axios from 'axios';

import {
  Reservation,
  ReservationCreateInput,
  ReservationFilters,
  ReservationOperationalStatus,
} from 'types/Reservation';

const api = axios.create({ baseURL: '/api/reservations' });

class ReservationsService {
  async list(filters: ReservationFilters): Promise<Reservation[]> {
    const { data } = await api.get<{ reservations: Reservation[] }>('/', {
      params: filters,
    });
    return data.reservations;
  }

  async create(input: ReservationCreateInput): Promise<Reservation> {
    const { data } = await api.post<{ reservation: Reservation }>('/', input);
    return data.reservation;
  }

  async updateOperationalStatus(
    id: string,
    operationalStatus: ReservationOperationalStatus
  ): Promise<Reservation> {
    const { data } = await api.patch<{ reservation: Reservation }>(`/${id}`, {
      operationalStatus,
    });
    return data.reservation;
  }
}

export default new ReservationsService();
