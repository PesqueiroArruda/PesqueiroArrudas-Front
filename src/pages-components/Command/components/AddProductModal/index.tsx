/* eslint-disable no-restricted-globals */
import {
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { useToast } from '@chakra-ui/react';

import CommandService from 'pages-components/Command/services/CommandService';
import ProductsService from 'pages-components/Command/services/ProductsService';
import KitchenService from 'pages-components/Command/services/KitchenService';
import { Command } from 'types/Command';
import { formatAmount } from 'utils/formatAmount';
import { Product } from 'types/Product';
import { CommandContext } from 'pages-components/Command';
import { AddProductModalLayout } from './layout';
import { SetAmountModal } from './SetAmountModal';
import { StoreKitchen } from '../SendToKitchenModal';

interface AllProductsAction {
  type:
    | 'ADD-ALL-PRODUCTS'
    | 'UPDATE-ONE-PRODUCT'
    | 'FAVORITE-PRODUCT'
    | 'UNFAVORITE-PRODUCT';
  payload: any;
}
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  commandId: string | undefined;
  setCommand: Dispatch<SetStateAction<Command>>;
  allProducts: Product[];
  allProductsDispatch: Dispatch<AllProductsAction>;
}

interface ProductNoAmount {
  _id?: string;
  name: string;
  unitPrice: number;
  category: string;
}

export const AddProductModal = ({
  isModalOpen,
  setIsModalOpen,
  commandId,
  setCommand,
  allProducts,
  allProductsDispatch,
}: Props) => {
  const [selectedProducts, setSelectedProducts] = useState([] as any);

  const [isSetAmountModalOpen, setIsSetAmountModalOpen] = useState(false);
  const [productToSetAmount, setProductToSetAmount] = useState<ProductNoAmount>(
    {} as ProductNoAmount
  );
  const amount = useRef('1');

  const [filter, setFilter] = useState('');
  const [searchContent, setSearchContent] = useState('');

  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [isSelectingProduct, setIsSelectingProduct] = useState(false);

  const [observation, setObservation] = useState('');
  const [sendToKitchen, setSendToKitchen] = useState(true);

  const { productsDispatch } = useContext(CommandContext);
  const toast = useToast();

  function handleCloseModal() {
    setIsModalOpen(false);
    setIsAddingProducts(false);
    setIsSelectingProduct(false);
    setObservation('');
    amount.current = '1';
  }

  // This function receives the product infos of the product clicked and opens the modal to select the amount of this
  function handleOpenAmountModal({ product }: { product: ProductNoAmount }) {
    setProductToSetAmount(product);
    setIsSetAmountModalOpen(true);
    amount.current = '1';
  }

  // This function add in selected products list. Takes the object with infos based on the click of the user,
  // and add the amount propertie containing the amount selected by the user in modal
  async function handleAddProduct(e: any) {
    e.preventDefault();
    try {
      if (isSelectingProduct) {
        return;
      }
      setIsSelectingProduct(true);
      const hasBeenSelected = selectedProducts.some(
        (selectedProduct: any) =>
          selectedProduct.name === productToSetAmount.name
      );
      if (hasBeenSelected) {
        setIsSetAmountModalOpen(false);
        setIsSelectingProduct(false);
        toast.closeAll();
        toast({
          title: 'Produto já foi selecionado',
          status: 'warning',
        });
        return;
      }

      const formattedAmount = Number(
        formatAmount({ num: amount.current, to: 'point' })
      );

      if (Number.isNaN(formattedAmount)) {
        setIsSelectingProduct(false);
        toast.closeAll();
        toast({
          status: 'error',
          title: 'Número inválido',
          duration: 1000,
          isClosable: true,
        });
        return;
      }

      setSelectedProducts((prev: any) => [
        ...prev,
        {
          ...productToSetAmount,
          amount: formattedAmount.toString(),
          totalPayed: 0,
        },
      ]);
      setIsSetAmountModalOpen(false);
      setIsSelectingProduct(false);
    } catch (error: any) {
      setIsSelectingProduct(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message,
        duration: 2000,
        isClosable: true,
      });
    }
  }

  function handleRemoveSelectedProduct({ id }: { id: string }) {
    setSelectedProducts((prev: any) =>
      prev.filter((product: any) => product._id !== id)
    );
  }


  const categoriesToKitchenPrepare = ['pratos', 'porções', 'bebidas-cozinha']
  const categoriesToBarPrepare = [
    'pesca',
    'peixes',
    'bebidas',
    'doses',
    'sobremesas',
    'misturas congeladas',
  ]
  const { command: commandContext } = useContext(CommandContext);
  const handleSendToKitchen = useCallback(async () => {
      try {
        const { command: commandFound } = await CommandService.getOneCommand({
          commandId,
        })

        const { table, waiter, products } = commandFound
  
        const productsToPrepareKitchen = products?.filter(({ category } : { category: any }) =>
          categoriesToKitchenPrepare.some(
            (categ) => category?.toLowerCase() === categ
          )
        );

        const productsToPrepareBar = products?.filter(({ category } : { category: any }) =>
          categoriesToBarPrepare.some(
            (categ) => category?.toLowerCase() === categ
          )
        );

        Promise.all([
          await KitchenService.storeKitchenOrder({
            commandId,
            table,
            waiter,
            products: productsToPrepareKitchen,
            observation,
            orderCategory: 'kitchen',
            orderWaiter: waiter
          } as StoreKitchen),
          await KitchenService.storeKitchenOrder({
            commandId,
            table,
            waiter,
            products: productsToPrepareBar,
            observation,
            orderCategory: 'bar',
            orderWaiter: waiter
          } as StoreKitchen)
        ]) 

        toast.closeAll();
        toast({
          status: 'success',
          title: 'Pedido enviado à cozinha!',
        });
      } catch (error: any) {
        toast.closeAll();
        console.log(error)
        toast({
          status: 'error',
          title: error?.response?.data?.message || 'Erro em mandar para cozinha',
          duration: 2000,
          isClosable: true,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandContext, observation]);

  
  async function handleAddProductsInCommand() {
    try {
      if (isAddingProducts) {
        return;
      }
      setIsAddingProducts(true);

      // Buscar a comanda atual
      const { command } = await CommandService.getOneCommand({ commandId });

      // Verificar estoque antes de adicionar/incrementar
      const allAvailable = await Promise.all(
        selectedProducts.map((product: Product) =>
          ProductsService.verifyAmount({
            productId: product?._id as string,
            amount: product?.amount,
          })
        )
      );

      if (!allAvailable) {
        return;
      }

      // Copiar produtos da comanda
      const updatedProducts = [...(command?.products || [])];

      // Para cada produto selecionado, verificar se já existe
      selectedProducts.forEach((selectedProduct: any) => {
        const index = updatedProducts.findIndex(
          (p: any) => p._id === selectedProduct._id
        );

        if (index !== -1) {
          // Se já existe, incrementar quantidade
          updatedProducts[index].amount =
            Number(updatedProducts[index].amount) + Number(selectedProduct.amount);
        } else {
          // Se não existe, adicionar normalmente
          updatedProducts.push(selectedProduct);
        }
      });

      // Atualiza a comanda no banco
      const { command: updatedCommand } = await CommandService.updateCommand({
        _id: commandId,
        products: updatedProducts,
      });

      // Atualizar estado local
      setCommand(updatedCommand);
      productsDispatch({
        type: 'add-products',
        payload: updatedCommand.products,
      });

      // Atualizar estoque
      selectedProducts.forEach((selectedProduct: { _id: string; amount: string }) => {
        (async () => {
          const { product: stockUpdatedProduct } =
            await ProductsService.diminishAmount({
              productId: selectedProduct._id,
              amount: Number(selectedProduct.amount),
            });

          allProductsDispatch({
            type: 'UPDATE-ONE-PRODUCT',
            payload: { product: stockUpdatedProduct },
          });
        })();
      });

      // Feedback
      toast.closeAll();
      toast({
        status: 'success',
        title: 'Produtos adicionados/incrementados na comanda',
        duration: 2000,
        isClosable: true,
      });

      // Envia para cozinha se necessário
      if (sendToKitchen) {
        await handleSendToKitchen();
      }

      cleanModalValues();
      handleCloseModal();
    } catch (error: any) {
      setIsAddingProducts(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message,
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const cleanModalValues = useCallback(() => {
    setSelectedProducts([]);
    amount.current = '1';
    setFilter('');
    setSearchContent('');
    setObservation('');
  }, []);

  function handleChangeFilter(selectedFilter: string) {
    setFilter((prevFilter) => {
      if (selectedFilter === prevFilter) {
        return '';
      }
      return selectedFilter;
    });
  }

  const handleFavoriteProduct = useCallback(
    async (_id: string) => {
      allProductsDispatch({
        type: 'FAVORITE-PRODUCT',
        payload: { product: { _id } },
      });

      await ProductsService.updateFavoriteStatus({
        productId: _id,
        isFavorite: true,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allProducts, allProductsDispatch]
  );

  const handleUnfavoriteProduct = useCallback(
    async (_id: string) => {
      allProductsDispatch({
        type: 'UNFAVORITE-PRODUCT',
        payload: { product: { _id } },
      });

      await ProductsService.updateFavoriteStatus({
        productId: _id,
        isFavorite: false,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allProducts, allProductsDispatch]
  );

  const filteredByFilter = useMemo(() => {
    if (filter === '') {
      return allProducts;
    }
    const filtered = allProducts.filter(({ category }) => category === filter);
    return filtered;
  }, [filter, allProducts]);

  const filteredBySearch = useMemo(() => {
    const filtered = filteredByFilter.filter((product: any) => {
      const productObjStr = Object.values(product).join('').toLocaleLowerCase();
      if (productObjStr?.includes(searchContent.toLowerCase())) {
        return true;
      }
      return false;
    });
    return filtered;
  }, [filteredByFilter, searchContent]);

  return (
    <>
      <AddProductModalLayout
        products={filteredBySearch}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedProducts={selectedProducts}
        handleOpenAmountModal={handleOpenAmountModal}
        handleRemoveSelectedProduct={handleRemoveSelectedProduct}
        handleAddProductsInCommand={handleAddProductsInCommand}
        filter={filter}
        handleChangeFilter={handleChangeFilter}
        searchContent={searchContent}
        setSearchContent={setSearchContent}
        isAddingProducts={isAddingProducts}
        handleFavoriteProduct={handleFavoriteProduct}
        handleUnfavoriteProduct={handleUnfavoriteProduct}
        setObservation={setObservation}
        observation={observation}
        setSendToKitchen={setSendToKitchen}
        sendToKitchen={sendToKitchen}
      />
      {/* Set amount of product modal */}
      <SetAmountModal
        isSetAmountModalOpen={isSetAmountModalOpen}
        setIsSetAmountModalOpen={setIsSetAmountModalOpen}
        amount={amount}
        handleAddProduct={handleAddProduct}
        isFishesCategory={
          productToSetAmount?.category?.toLowerCase() === 'peixes' ||
          productToSetAmount?.category?.toLowerCase() === 'misturas congeladas'
        }
        isSelectingProduct={isSelectingProduct}
      />
    </>
  );
};
