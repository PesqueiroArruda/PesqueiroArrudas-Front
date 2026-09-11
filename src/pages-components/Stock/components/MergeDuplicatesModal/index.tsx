import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { findSimilarProductGroups } from 'utils/findSimilarProductGroups';
import { StockContext } from 'pages-components/Stock';
import { Product } from 'pages-components/Stock/types/Product';
import StockService from '../../services/index';
import { MergeDuplicatesModalLayout } from './layout';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const MergeDuplicatesModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { products, productsDispatch } = useContext(StockContext);
  const toast = useToast();

  const [groups, setGroups] = useState<Product[][]>([]);
  const [survivorByGroup, setSurvivorByGroup] = useState<Record<number, string>>({});
  const [excludedByGroup, setExcludedByGroup] = useState<Record<number, Set<string>>>({});
  const [mergingGroupIndex, setMergingGroupIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    setGroups(findSimilarProductGroups(products));
    setSurvivorByGroup({});
    setExcludedByGroup({});
  }, [isModalOpen, products]);

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleSelectSurvivor(groupIndex: number, productId: string) {
    setSurvivorByGroup((prev) => ({ ...prev, [groupIndex]: productId }));
  }

  function handleToggleExclude(groupIndex: number, productId: string, include: boolean) {
    setExcludedByGroup((prev) => {
      const next = new Set(prev[groupIndex] || []);
      if (include) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return { ...prev, [groupIndex]: next };
    });
  }

  async function handleMergeGroup(groupIndex: number) {
    const group = groups[groupIndex];
    if (!group) return;

    const survivorId = survivorByGroup[groupIndex] || group[0]._id || '';
    const excluded = excludedByGroup[groupIndex] || new Set<string>();
    const mergedIds = group
      .filter((product) => product._id !== survivorId && !excluded.has(product._id || ''))
      .map((product) => product._id as string);

    if (mergedIds.length === 0) {
      toast({
        status: 'error',
        title: 'Selecione ao menos um item pra mesclar com o sobrevivente.',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      setMergingGroupIndex(groupIndex);
      const { product: mergedSurvivor } = await StockService.mergeProducts({ survivorId, mergedIds });

      mergedIds.forEach((id) => {
        productsDispatch({ type: 'REMOVE-ONE-PRODUCT', payload: { id } });
      });
      productsDispatch({ type: 'UPDATE-ONE-PRODUCT', payload: { product: mergedSurvivor } });

      setGroups((prev) => prev.filter((_, index) => index !== groupIndex));

      toast.closeAll();
      toast({
        status: 'success',
        title: 'Itens mesclados',
        duration: 1500,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível mesclar esses itens.',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMergingGroupIndex(null);
    }
  }

  return (
    <MergeDuplicatesModalLayout
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      groups={groups}
      survivorByGroup={survivorByGroup}
      excludedByGroup={excludedByGroup}
      handleSelectSurvivor={handleSelectSurvivor}
      handleToggleExclude={handleToggleExclude}
      handleMergeGroup={handleMergeGroup}
      mergingGroupIndex={mergingGroupIndex}
    />
  );
};
