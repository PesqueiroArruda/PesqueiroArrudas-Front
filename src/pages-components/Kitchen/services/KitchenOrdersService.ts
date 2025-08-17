import { serverApi } from 'services/serverApi';
import { OrderProduct } from '../../../types/OrderProduct';

interface CheckOneProduct {
  orderId: string;
  products: OrderProduct[];
  isThawed?: boolean;
}
interface UpdateOrderFlags {
  orderId: string;
  isMade?: boolean;
  isThawed?: boolean;
}

interface CheckOneOrder {
  orderId: string;
  isMade: boolean;
}
class KitchenOrdersService {
  async getAll() {
    const { data } = await serverApi.get('/kitchen/orders');
    return data;
  }

  async checkOneOrder({ orderId, isMade }: CheckOneOrder) {
    const { data } = await serverApi.put(`/kitchen/orders/${orderId}`, {
      isMade,
    });
    return data;
  }

  async checkOneOrderProduct({ orderId, products }: CheckOneProduct) {
    const { data } = await serverApi.put(`/kitchen/orders/${orderId}`, {
      products,
    });
    return data;
  }

  async defrostOneOrderProduct({ orderId, products }: CheckOneProduct) {
    const { data } = await serverApi.put(`/kitchen/orders/${orderId}`, {
      products,
      isThawed: true, // <-- sinaliza defrost
    });
    return data;
  }

  async updateOrderFlags({ orderId, isMade, isThawed }: UpdateOrderFlags) {
    const body: Record<string, any> = {};
    if (typeof isMade === 'boolean') body.isMade = isMade;
    if (typeof isThawed === 'boolean') body.isThawed = isThawed;

    const { data } = await serverApi.put(`/kitchen/orders/${orderId}`, body);
    return data;
  }
}

export default new KitchenOrdersService();
