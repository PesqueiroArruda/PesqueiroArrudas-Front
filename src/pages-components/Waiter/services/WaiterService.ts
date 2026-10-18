import { serverApi } from 'services/serverApi';

export interface WaiterProduct {
  _id: string;
  name: string;
  category?: string;
  unitPrice: number;
  amount?: number | null;
  isFavorite?: boolean;
}

export interface WaiterCommandItem {
  _id: string;
  name: string;
  amount: number;
  unitPrice: number;
  category?: string;
}

export interface WaiterCommand {
  _id: string;
  table: string;
  waiter: string;
  fishingType?: string;
  peopleCount?: number;
  isActive?: boolean;
  createdAt?: string;
  products: WaiterCommandItem[];
}

class WaiterService {
  async getCommands(): Promise<WaiterCommand[]> {
    const { data } = await serverApi.get('/commands');
    return data;
  }

  async getCommand(id: string): Promise<WaiterCommand> {
    const { data } = await serverApi.get(`/commands/${id}`);
    return data.command;
  }

  async createCommand(payload: {
    table: string;
    fishingType: string;
    peopleCount: number;
  }): Promise<WaiterCommand> {
    const { data } = await serverApi.post('/commands', payload);
    return data.command;
  }

  async getProducts(): Promise<WaiterProduct[]> {
    const { data } = await serverApi.get('/products');
    return data;
  }

  async addItem(
    commandId: string,
    payload: { productId: string; amount: number; observation?: string }
  ): Promise<WaiterCommand> {
    const { data } = await serverApi.post(`/commands/${commandId}/items`, payload);
    return data.command;
  }
}

export default new WaiterService();
