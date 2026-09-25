import { serverApi } from 'services/serverApi';

interface Pay {
  commandId: string;
  paymentTypes: string[];
  waiterExtra: number;
  observation?: string;
  discount: number;
  paymentDate?: string;
}

class PaymentsService {
  async pay({
    commandId,
    paymentTypes,
    waiterExtra,
    observation,
    discount,
    paymentDate,
  }: Pay) {
    const { data } = await serverApi.post('/payments', {
      commandId,
      paymentTypes,
      waiterExtra,
      observation,
      discount,
      ...(paymentDate ? { paymentDate } : {}),
    });
    return data;
  }
}

export default new PaymentsService();
