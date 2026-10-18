import type { MenuConfig } from 'pages-components/Stock/types/Product';

export interface Product {
  _id: string;
  name: string;
  amount: number;
  unitPrice: number;
  category?: string;
  totalPayed?: number;
  isFavorite?: boolean;
  imageURL?: string;
  menu?: MenuConfig;
  // Quando preenchido, o saldo vem do produto apontado (ex.: item do iFood).
  stockSourceId?: string | null;
}
