import { serverApi } from 'services/serverApi';

class IfoodOrdersService {
  async getAllPending() {
    const { data } = await serverApi.get('/ifood/orders', {
      params: { status: 'pending' },
    });
    return data;
  }

  async accept(id: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/accept`);
    return data;
  }

  async reject(id: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/reject`);
    return data;
  }
}

export default new IfoodOrdersService();
