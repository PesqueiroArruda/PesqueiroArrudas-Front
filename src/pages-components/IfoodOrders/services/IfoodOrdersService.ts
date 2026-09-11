import { serverApi } from 'services/serverApi';
import { IfoodCancellationReason, ResolvedIfoodItem } from 'types/IfoodOrder';

class IfoodOrdersService {
  async getAllPending() {
    const { data } = await serverApi.get('/ifood/orders', {
      params: { status: 'pending,cancellation_requested' },
    });
    return data;
  }

  async getProductMappings() {
    const { data } = await serverApi.get('/ifood/product-mappings');
    return data;
  }

  async accept(id: string, items: ResolvedIfoodItem[]) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/accept`, { items });
    return data;
  }

  async getCancellationReasons(id: string): Promise<IfoodCancellationReason[]> {
    const { data } = await serverApi.get(`/ifood/orders/${id}/cancellation-reasons`);
    return data;
  }

  async reject(id: string, cancelCodeId: string, reason: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/reject`, { cancelCodeId, reason });
    return data;
  }

  async acceptCancellation(id: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/accept-cancellation`);
    return data;
  }

  async denyCancellation(id: string, reason: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/deny-cancellation`, { reason });
    return data;
  }
}

export default new IfoodOrdersService();
