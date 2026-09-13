import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

import { Button } from 'components/ui/button';
import { MENU_CATEGORIES, Product } from 'pages-components/Stock/types/Product';

interface Props {
  itemsNotInMenu: Product[];
  onAdd: (product: Product, category: string) => void;
}

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const AddToMenuPanel = ({ itemsNotInMenu, onAdd }: Props) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    MENU_CATEGORIES[0]
  );

  function handleAdd() {
    const product = itemsNotInMenu.find(
      (item) => item._id === selectedProductId
    );
    if (!product) return;

    onAdd(product, selectedCategory);
    setSelectedProductId('');
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <span className="text-sm font-semibold text-navy">Item do estoque</span>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className={selectClassName}
        >
          <option value="">Selecione um item para adicionar ao cardápio</option>
          {itemsNotInMenu.map((item) => (
            <option key={item._id} value={item._id || ''}>
              {item.name} ({item.category})
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-56">
        <span className="text-sm font-semibold text-navy">
          Categoria do cardápio
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={selectClassName}
        >
          {MENU_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Button type="button" onClick={handleAdd} disabled={!selectedProductId}>
        <PackagePlus className="h-4 w-4" />
        Adicionar ao Cardápio
      </Button>
    </div>
  );
};
