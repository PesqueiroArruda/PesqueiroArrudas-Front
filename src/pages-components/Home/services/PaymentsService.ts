import { serverApi } from 'services/serverApi';

class PaymentsService {
  async getAll({ date }: { date: any }) {
    const { data } = await serverApi.get(`/payments?date=${date}`);
    return data;
  }

  async updateDate({ id, paymentDate }: { id: string; paymentDate: string }) {
    const { data } = await serverApi.put(`/payments/${id}/date`, { paymentDate });
    return data;
  }
}

export default new PaymentsService();
