import { ChefHat, Home, Package, ReceiptText } from 'lucide-react';

export const navItems = [
  { text: 'Home', icon: Home, path: '/' },
  { text: 'Comandas', icon: ReceiptText, path: '/commands' },
  { text: 'Cozinha', icon: ChefHat, path: '/kitchen' },
  { text: 'Estoque', icon: Package, path: '/stock' },
];
