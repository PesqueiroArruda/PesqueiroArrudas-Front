import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { StockContext } from 'pages-components/Stock';
import { Product } from 'types/Product';
import { hasIfoodToken, listIfoodSuggestions } from 'utils/suggestStockSource';
import StockService from '../../services/index';
import { LinkIfoodProductsModalLayout, LinkRow, LinkSelection } from './layout';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const LinkIfoodProductsModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { products, productsDispatch } = useContext(StockContext);
  const toast = useToast();

  const [rows, setRows] = useState<LinkRow[]>([]);
  const [selections, setSelections] = useState<Record<string, LinkSelection>>({});
  const [isApplying, setIsApplying] = useState(false);

  // Só recalcula ao abrir, pra a lista não mudar sozinha enquanto o usuário
  // confere (o estoque recebe atualizações em tempo real).
  useEffect(() => {
    if (!isModalOpen) return;
    const nextRows = listIfoodSuggestions(products as Product[]);
    setRows(nextRows);
    setSelections(
      Object.fromEntries(
        nextRows.map(({ product, suggestion }) => [
          product._id as string,
          {
            sourceId: suggestion?.sourceId ?? null,
            // Só "nome igual" já vem marcado; "parecido" o usuário marca.
            checked: suggestion?.confidence === 'exact',
          },
        ])
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // Origem possível: qualquer produto que não usa o estoque de outro, com os
  // do salão primeiro.
  const sourceOptions = useMemo(
    () =>
      (products as Product[])
        .filter((product) => product._id && !product.stockSourceId)
        .sort((a, b) => Number(hasIfoodToken(a.name)) - Number(hasIfoodToken(b.name))),
    [products]
  );

  const selectedCount = rows.filter(({ product }) => {
    const selection = selections[product._id as string];
    return selection?.checked && selection?.sourceId;
  }).length;

  function handleChangeSource(productId: string, sourceId: string) {
    setSelections((prev) => ({
      ...prev,
      [productId]: { sourceId: sourceId || null, checked: Boolean(sourceId) },
    }));
  }

  function handleToggleChecked(productId: string, checked: boolean) {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], checked },
    }));
  }

  async function handleApply() {
    const toLink = rows.filter(({ product }) => {
      const selection = selections[product._id as string];
      return selection?.checked && selection?.sourceId;
    });
    if (toLink.length === 0) return;

    setIsApplying(true);
    let linked = 0;
    const failed: string[] = [];
    const linkedIds = new Set<string>();

    // Um por vez: o backend valida cada vínculo contra o estado atual.
    // eslint-disable-next-line no-restricted-syntax
    for (const { product } of toLink) {
      const id = product._id as string;
      const source = (products as Product[]).find((item) => item._id === selections[id].sourceId);
      try {
        // eslint-disable-next-line no-await-in-loop
        const { product: updated } = await StockService.updateProduct({
          _id: id,
          name: product.name,
          category: product.category,
          imageURL: product.imageURL,
          unitPrice: product.unitPrice,
          menu: product.menu,
          // O saldo que vale é o da origem; o antigo deste produto é ignorado.
          amount: source?.amount ?? product.amount,
          stockSourceId: selections[id].sourceId,
        } as any);
        productsDispatch({ type: 'UPDATE-ONE-PRODUCT', payload: { product: updated } });
        linked += 1;
        linkedIds.add(id);
      } catch (error: any) {
        failed.push(`${product.name}: ${error?.response?.data?.message || 'erro ao vincular'}`);
      }
    }

    setRows((prev) => prev.filter(({ product }) => !linkedIds.has(product._id as string)));
    setIsApplying(false);

    toast.closeAll();
    if (linked > 0) {
      toast({
        status: 'success',
        title: `${linked} ${linked === 1 ? 'produto vinculado' : 'produtos vinculados'}`,
        duration: 2500,
        isClosable: true,
      });
    }
    if (failed.length > 0) {
      toast({
        status: 'error',
        title: 'Alguns não foram vinculados',
        description: failed.join(' | '),
        duration: null,
        isClosable: true,
      });
    }
  }

  return (
    <LinkIfoodProductsModalLayout
      isModalOpen={isModalOpen}
      handleCloseModal={() => setIsModalOpen(false)}
      rows={rows}
      sourceOptions={sourceOptions}
      selections={selections}
      handleChangeSource={handleChangeSource}
      handleToggleChecked={handleToggleChecked}
      handleApply={handleApply}
      isApplying={isApplying}
      selectedCount={selectedCount}
    />
  );
};
