import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { SocketContext } from 'pages/_app';
import StockService from 'pages-components/Stock/services';
import {
  EMPTY_MENU_CONFIG,
  MENU_CATEGORIES,
  Product,
} from 'pages-components/Stock/types/Product';
import { MenuOrganizationLayout } from './layout';
import { UNCATEGORIZED } from './constants';

export const MenuOrganization = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const allProducts = await StockService.getAllProducts();
      setProducts(allProducts);
      setIsLoading(false);
    })();
  }, []);

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
        const category = product.menu?.category;
        const key =
          category && (MENU_CATEGORIES as readonly string[]).includes(category)
            ? category
            : UNCATEGORIZED;
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
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
      groupedByCategory={groupedByCategory}
      itemsNotInMenu={itemsNotInMenu}
      handleDragEnd={handleDragEnd}
      handleAddToMenu={handleAddToMenu}
      handleRemoveFromMenu={handleRemoveFromMenu}
      handleGoToStock={handleGoToStock}
    />
  );
};
