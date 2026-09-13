import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

import { Button } from 'components/ui/button';
import { MENU_CATEGORIES, Product } from 'pages-components/Stock/types/Product';
import { StockItemSearch } from './StockItemSearch';

interface Props {
  itemsNotInMenu: Product[];
  onAdd: (product: Product, category: string) => void;
}

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const AddToMenuPanel = ({ itemsNotInMenu, onAdd }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    MENU_CATEGORIES[0]
  );

  function handleAdd() {
    if (!selectedProduct) return;

    onAdd(selectedProduct, selectedCategory);
    setSelectedProduct(null);
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <span className="text-sm font-semibold text-navy">Item do estoque</span>
        <StockItemSearch
          items={itemsNotInMenu}
          selectedProduct={selectedProduct}
          onSelect={setSelectedProduct}
        />
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

      <Button type="button" onClick={handleAdd} disabled={!selectedProduct}>
        <PackagePlus className="h-4 w-4" />
        Adicionar ao Cardápio
      </Button>
    </div>
  );
};
