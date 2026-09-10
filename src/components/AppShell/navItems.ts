import { ChefHat, Home, LayoutDashboard, Package, ReceiptText, ShoppingBag } from 'lucide-react';

export const navItems = [
  { text: 'Home', icon: Home, path: '/' },
  { text: 'Comandas', icon: ReceiptText, path: '/commands' },
  { text: 'Cozinha', icon: ChefHat, path: '/kitchen' },
  { text: 'iFood', icon: ShoppingBag, path: '/ifood-orders' },
  { text: 'Estoque', icon: Package, path: '/stock' },
  { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
];
