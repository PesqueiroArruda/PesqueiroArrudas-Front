import { serverApi } from 'services/serverApi';
import { ResolvedIfoodItem } from 'types/IfoodOrder';

class IfoodOrdersService {
  async getAllPending() {
    const { data } = await serverApi.get('/ifood/orders', {
      params: { status: 'pending' },
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

  async reject(id: string) {
    const { data } = await serverApi.post(`/ifood/orders/${id}/reject`);
    return data;
  }
}

export default new IfoodOrdersService();
