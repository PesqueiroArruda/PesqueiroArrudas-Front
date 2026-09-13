export const MENU_CATEGORIES = [
  'Especialidades',
  'Porções',
  'Prato Kids',
  'Acompanhamentos',
  'Bebidas',
  'Sobremesas',
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export interface MenuConfig {
  enabled: boolean;
  description: string;
  category: string;
  imageKey: string;
  order: number;
}

export interface Product {
  _id?: string;
  name: string;
  amount: number;
  imageURL?: string;
  category: string;
  unitPrice: number;
  isFavorite?: boolean;
  menu?: MenuConfig;
}

export const EMPTY_MENU_CONFIG: MenuConfig = {
  enabled: false,
  description: '',
  category: '',
  imageKey: '',
  order: 0,
};
