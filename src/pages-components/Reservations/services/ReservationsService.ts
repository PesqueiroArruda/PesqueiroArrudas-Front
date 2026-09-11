import axios from 'axios';

import { Reservation, ReservationFilters, ReservationOperationalStatus } from 'types/Reservation';

const api = axios.create({ baseURL: '/api/reservations' });

class ReservationsService {
  async list(filters: ReservationFilters): Promise<Reservation[]> {
    const { data } = await api.get<{ reservations: Reservation[] }>('/', { params: filters });
    return data.reservations;
  }

  async updateOperationalStatus(id: string, operationalStatus: ReservationOperationalStatus): Promise<Reservation> {
    const { data } = await api.patch<{ reservation: Reservation }>(`/${id}`, { operationalStatus });
    return data.reservation;
  }
}

export default new ReservationsService();
