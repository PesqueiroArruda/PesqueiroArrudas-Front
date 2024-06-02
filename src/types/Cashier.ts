export interface CashierProduct {
  _id: string;
  name: string;
  amount: number;
}

interface CashierCommand {
  _id: string;
  table: string;
  waiter: string;
  total: number;
  waiterExtra: number;
  products: CashierProduct[];
}

interface CashierPayment {
  _id: string;
  paymentTypes: string[];
  totalPayed: number;
  command: CashierCommand;
  waiterExtra?: number;
}

interface Cashier {
  _id: string;
  total: number;
  date: any;
  payments: CashierPayment[];
  month?: string;
  year?: string;
}

interface CashierByMonth {
  _id: string;
  month: string;
  year: string;
  total: number;
  payments: CashierPayment[];
}

export type { Cashier, CashierPayment, CashierByMonth };
