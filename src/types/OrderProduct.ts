export interface OrderProduct {
  _id: string;
  name: string;
  category?: string;
  isMade?: boolean;
  isThawed?: boolean;
  amount: number;
}
