import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { SocketContext } from 'pages/_app';
import StockService from 'pages-components/Stock/services';
import {
  EMPTY_MENU_CONFIG,
  MENU_CATEGORIES,
  Product,
} from 'pages-components/Stock/types/Product';
import MenuOrganizationService from './services';
import { MenuOrganizationLayout } from './layout';
import { UNCATEGORIZED } from './constants';

// Preenche categorias padrão que ainda não constam na ordem salva (ex.: uma
// categoria nova adicionada ao código depois do último salvamento) e ignora
// entradas salvas que não são mais uma categoria padrão.
function mergeCategoryOrder(savedOrder: string[]) {
  const known = new Set<string>(MENU_CATEGORIES);
  const valid = savedOrder.filter((category) => known.has(category));
  const missing = MENU_CATEGORIES.filter(
    (category) => !valid.includes(category)
  );
  return [...valid, ...missing];
}

function normalizeCategoryText(value: string) {
  return value.trim().toLowerCase();
}

const CANONICAL_CATEGORY_BY_NORMALIZED: Record<string, string> =
  MENU_CATEGORIES.reduce(
    (acc, category) => ({
      ...acc,
      [normalizeCategoryText(category)]: category,
    }),
    {} as Record<string, string>
  );

// Reconhece uma categoria salva mesmo com maiúsculas/espaços diferentes do
// texto padronizado (ex.: "especialidades" ou "Especialidades " ainda contam
// como "Especialidades") — evita que itens corretos caiam em "Sem categoria
// padrão" só por causa de uma diferença de digitação.
function resolveMenuCategory(rawCategory?: string): string {
  if (!rawCategory) return UNCATEGORIZED;
  return (
    CANONICAL_CATEGORY_BY_NORMALIZED[normalizeCategoryText(rawCategory)] ||
    UNCATEGORIZED
  );
}

export const MenuOrganization = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([
    ...MENU_CATEGORIES,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [allProducts, savedCategoryOrder] = await Promise.all([
          StockService.getAllProducts(),
          MenuOrganizationService.getCategoryOrder(),
        ]);

        // Autocorrige itens habilitados cuja categoria salva só difere da
        // padronizada por maiúsculas/espaços (ex.: "especialidades" salva
        // como "Especialidades"), tanto na tela quanto no banco.
        const correctedProducts = allProducts.map((product: Product) => {
          const rawCategory = product.menu?.category;
          if (!product.menu?.enabled || !rawCategory) return product;

          const canonical = resolveMenuCategory(rawCategory);
          if (canonical === UNCATEGORIZED || canonical === rawCategory)
            return product;

          return { ...product, menu: { ...product.menu, category: canonical } };
        });

        setProducts(correctedProducts);
        setCategoryOrder(mergeCategoryOrder(savedCategoryOrder));

        const toFix = correctedProducts.filter(
          (product: Product, index: number) =>
            product.menu?.category !== allProducts[index].menu?.category
        );
        if (toFix.length > 0) {
          Promise.all(
            toFix.map((product: Product) => StockService.updateProduct(product))
          ).catch(() => {
            toast({
              status: 'error',
              title:
                'Algumas categorias foram corrigidas só na tela — recarregue a página pra tentar salvar de novo.',
              duration: 5000,
              isClosable: true,
            });
          });
        }
      } catch {
        toast({
          status: 'error',
          title: 'Falha ao carregar o cardápio. Recarregue a página.',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleReorderCategories = useCallback(
    async (newOrder: string[]) => {
      setCategoryOrder(newOrder);

      try {
        await MenuOrganizationService.updateCategoryOrder(newOrder);
      } catch {
        toast({
          status: 'error',
          title: 'Falha ao salvar a ordem das categorias. Tente novamente.',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);

    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  useEffect(() => {
    const onProductUpdated = (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    };
    socket.on('product-updated', onProductUpdated);

    return () => {
      socket.off('product-updated', onProductUpdated);
    };
  }, [socket]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    MENU_CATEGORIES.forEach((category) => {
      groups[category] = [];
    });
    groups[UNCATEGORIZED] = [];

    products
      .filter((product) => product.menu?.enabled)
      .forEach((product) => {
        const key = resolveMenuCategory(product.menu?.category);
        groups[key].push(product);
      });

    Object.keys(groups).forEach((key) => {
      groups[key] = [...groups[key]].sort(
        (a, b) => (a.menu?.order ?? 0) - (b.menu?.order ?? 0)
      );
    });

    return groups;
  }, [products]);

  const itemsNotInMenu = useMemo(
    () => products.filter((product) => !product.menu?.enabled),
    [products]
  );

  const applyLocalUpdates = useCallback((updates: Product[]) => {
    setProducts((prev) =>
      prev.map((product) => {
        const updated = updates.find((item) => item._id === product._id);
        return updated || product;
      })
    );
  }, []);

  const persistUpdates = useCallback(
    async (updates: Product[], originals: Product[]) => {
      const changed = updates.filter((updated) => {
        const original = originals.find((item) => item._id === updated._id);
        return (
          !original ||
          original.menu?.order !== updated.menu?.order ||
          original.menu?.category !== updated.menu?.category ||
          original.menu?.enabled !== updated.menu?.enabled
        );
      });

      if (!changed.length) return;

      try {
        await Promise.all(
          changed.map((product) => StockService.updateProduct(product))
        );
      } catch {
        toast({
          status: 'error',
          title: 'Falha ao salvar a organização do cardápio. Tente novamente.',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const reorderCategory = useCallback(
    (categoryKey: string, orderedItems: Product[]) => {
      const originals = orderedItems;
      const updates = orderedItems.map((item, index) => ({
        ...item,
        menu: {
          ...(item.menu || EMPTY_MENU_CONFIG),
          enabled: true,
          category:
            categoryKey === UNCATEGORIZED
              ? item.menu?.category || ''
              : categoryKey,
          order: index,
        },
      }));

      applyLocalUpdates(updates);
      persistUpdates(updates, originals);
    },
    [applyLocalUpdates, persistUpdates]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id);
      const found = products.find((product) => product._id === id);
      setActiveProduct(found || null);
    },
    [products]
  );

  const handleDragCancel = useCallback(() => {
    setActiveProduct(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveProduct(null);

      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const findCategoryOf = (id: string) =>
        Object.keys(groupedByCategory).find((key) =>
          groupedByCategory[key].some((product) => product._id === id)
        );

      const sourceCategory = findCategoryOf(activeId);
      if (!sourceCategory) return;

      const destCategory =
        overId in groupedByCategory ? overId : findCategoryOf(overId);
      if (!destCategory) return;

      const sourceItems = [...groupedByCategory[sourceCategory]];
      const oldIndex = sourceItems.findIndex((item) => item._id === activeId);
      if (oldIndex === -1) return;

      if (sourceCategory === destCategory) {
        const overIndex = sourceItems.findIndex((item) => item._id === overId);
        const newIndex = overIndex === -1 ? sourceItems.length - 1 : overIndex;
        if (oldIndex === newIndex) return;

        const reordered = arrayMove(sourceItems, oldIndex, newIndex);
        reorderCategory(sourceCategory, reordered);
        return;
      }

      const destItems = [...groupedByCategory[destCategory]];
      const [moved] = sourceItems.splice(oldIndex, 1);
      const overIndex = destItems.findIndex((item) => item._id === overId);
      const insertIndex = overIndex === -1 ? destItems.length : overIndex;
      destItems.splice(insertIndex, 0, moved);

      reorderCategory(sourceCategory, sourceItems);
      reorderCategory(destCategory, destItems);
    },
    [groupedByCategory, reorderCategory]
  );

  const handleAddToMenu = useCallback(
    async (product: Product, category: string) => {
      const updated: Product = {
        ...product,
        menu: {
          ...(product.menu || EMPTY_MENU_CONFIG),
          enabled: true,
          category,
          order: groupedByCategory[category]?.length || 0,
        },
      };

      applyLocalUpdates([updated]);

      try {
        await StockService.updateProduct(updated);
        toast({
          status: 'success',
          title: `${product.name} adicionado ao cardápio.`,
          duration: 2000,
          isClosable: true,
        });
      } catch {
        toast({
          status: 'error',
          title: 'Falha ao adicionar o item ao cardápio.',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [applyLocalUpdates, groupedByCategory, toast]
  );

  const handleRemoveFromMenu = useCallback(
    async (product: Product) => {
      const updated: Product = {
        ...product,
        menu: {
          ...(product.menu || EMPTY_MENU_CONFIG),
          enabled: false,
        },
      };

      applyLocalUpdates([updated]);

      try {
        await StockService.updateProduct(updated);
      } catch {
        toast({
          status: 'error',
          title: 'Falha ao remover o item do cardápio.',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [applyLocalUpdates, toast]
  );

  function handleGoToStock() {
    router.push('/stock');
  }

  if (!isAdmin) {
    return <div />;
  }

  return (
    <MenuOrganizationLayout
      isLoading={isLoading}
      categoryOrder={categoryOrder}
      groupedByCategory={groupedByCategory}
      itemsNotInMenu={itemsNotInMenu}
      activeProduct={activeProduct}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      handleDragCancel={handleDragCancel}
      handleAddToMenu={handleAddToMenu}
      handleRemoveFromMenu={handleRemoveFromMenu}
      handleReorderCategories={handleReorderCategories}
      handleGoToStock={handleGoToStock}
    />
  );
};
