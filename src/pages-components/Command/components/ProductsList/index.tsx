import { useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';

import CommandService from 'pages-components/Command/services/CommandService';
import { formatAmount } from 'utils/formatAmount';
import { Product } from 'types/Product';
import ProductsService from 'pages-components/Command/services/ProductsService';
import { normalizeSearch } from 'utils/normalizeSearch';
import { planAmountChange } from 'utils/planAmountChange';
import { CommandContext } from '../../index';
import { ProductsListLayout } from './layout';
import { PayProductModal } from './PayProductModal';

interface AmountProduct {
  _id: string;
  unitPrice: number;
  totalPayed: number;
  amount: number;
}

// Tempo parado sem clicar em + ou - antes de mandar a quantidade final pra API.
const AMOUNT_CLICKS_DEBOUNCE_MS = 500;

export const ProductsList = ({isAdmin} : {isAdmin: boolean}) => {
  const [fishIdToEditAmount, setFishIdToEditAmount] = useState('');
  const [newProductAmount, setNewProductAmount] = useState('');

  const [productToPay, setProductToPay] = useState<Product>({} as Product);
  const [isPayProductModalOpen, setIsPayProductModalOpen] = useState(false);

  const {
    products,
    productsDispatch,
    handleOpenDeleteModal,
    filter,
    orderBy,
    orderByDir,
    setOrderByDir,
    searchContent,
    command,
    setCommand,
    stockProductsDispatch,
  } = useContext(CommandContext);

  const toast = useToast();

  // This function enables the edition of the amount of some fish
  function handleActiveEditFishAmount({
    productId,
    amount,
  }: {
    productId: string;
    amount: string;
  }) {
    setNewProductAmount(
      formatAmount({ num: amount.toString(), to: 'comma' }).toString()
    );
    setFishIdToEditAmount(productId);
  }

  // Function that updates the amount of fish product in fact
  async function handleUpdateProductAmount(
    e: any,
    { productId, isFish }: { productId: string; isFish: boolean }
  ) {
    try {
      e.preventDefault();
      setFishIdToEditAmount('');

      const newAmount = Number(
        isFish
          ? formatAmount({
              num: newProductAmount,
              to: 'point',
            })
          : newProductAmount
      );

      if (Number.isNaN(newAmount)) {
        toast({
          status: 'error',
          title: 'Quantidade inválida',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (newAmount < 0) {
        toast({
          status: 'warning',
          title: 'Quantidade menor que 0',
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      const oldProducts = command?.products;
      const newProducts = oldProducts?.map((product) => {
        if (product._id === productId) {
          const newProduct = {
            ...product,
            amount: newAmount as number,
          };
          return newProduct;
        }
        return product;
      });

      const oldProductAmount = oldProducts?.find(
        (product) => product._id === productId
      )?.amount as number;

      if ((oldProductAmount > newAmount) && isAdmin) {
        // If the amount of product before updated it is less than the newAmount. it means I NEED TO INCREASE THE AMOUNT IN STOCK
        const amountToIncreaseInStock = oldProductAmount - Number(newAmount);
        const { product: stockUpdatedProduct } =
          await ProductsService.increaseAmount({
            productId,
            amount: amountToIncreaseInStock,
          });

        // Updating the AddProductModal list of stock products with new updtedProduc amount
        stockProductsDispatch({
          type: 'UPDATE-ONE-PRODUCT',
          payload: { product: stockUpdatedProduct },
        });
      }

      if (newAmount > oldProductAmount) {
        // it means the amount increased. so I need to DECREASE THE diff between the old amount and new amount in stock
        const amountToDiminishInStock = Number(newAmount) - oldProductAmount;
        const { product: stockUpdatedProduct } =
          await ProductsService.diminishAmount({
            productId,
            amount: amountToDiminishInStock,
          });
        stockProductsDispatch({
          type: 'UPDATE-ONE-PRODUCT',
          payload: { product: stockUpdatedProduct },
        });
      }


      if((newAmount > oldProductAmount) || ((newAmount > oldProductAmount) && isAdmin)) {
        const { command: updatedCommand } = await CommandService.updateCommand({
          _id: command?._id,
          products: newProducts,
        });

        setCommand(updatedCommand);

        productsDispatch({
          type: 'update-product-amount',
          payload: {
            product: {
              id: productId,
              amount: newAmount,
            },
          },
        });
      }
      
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message,
        duration: 2000,
        isClosable: true,
      });
    }
  }

  function handleOpenPayProductModal(product: Product) {
    setIsPayProductModalOpen(true);
    setProductToPay(product);
  }

  // Cliques em + e - só mexem na tela na hora. A API é chamada uma vez, com a
  // quantidade final, depois de AMOUNT_CLICKS_DEBOUNCE_MS sem novos cliques.
  // pendingAmounts guarda a quantidade desejada por produto (absoluta, então
  // repetir a chamada não soma duas vezes).
  const [pendingAmounts, setPendingAmounts] = useState<Record<string, number>>({});
  const pendingRef = useRef<Record<string, number>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Fila única: cada envio troca o array de produtos da comanda inteiro, então
  // dois produtos não podem sair ao mesmo tempo a partir do mesmo snapshot.
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const isMountedRef = useRef(true);
  const commandRef = useRef(command);
  const isAdminRef = useRef(isAdmin);

  useEffect(() => {
    commandRef.current = command;
  }, [command]);

  useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setPending = useCallback((productId: string, amount: number | null) => {
    const next = { ...pendingRef.current };
    if (amount === null) delete next[productId];
    else next[productId] = amount;
    pendingRef.current = next;
    if (isMountedRef.current) setPendingAmounts(next);
  }, []);

  const notify = useCallback(
    (options: Parameters<typeof toast>[0]) => {
      if (!isMountedRef.current) return;
      toast.closeAll();
      toast(options);
    },
    [toast]
  );

  const flushAmountChange = useCallback(
    async (productId: string) => {
      const target = pendingRef.current[productId];
      if (target === undefined) return;

      const findServerAmount = () =>
        commandRef.current?.products?.find((product: Product) => product._id === productId)
          ?.amount;

      const firstAmount = findServerAmount();
      if (!commandRef.current?._id || firstAmount === undefined) {
        setPending(productId, null);
        notify({ status: 'warning', title: 'O produto não está mais na comanda', duration: 2000 });
        return;
      }

      const firstPlan = planAmountChange(firstAmount, target);
      if (!firstPlan.operation) {
        setPending(productId, null);
        return;
      }

      try {
        if (firstPlan.operation === 'diminish') {
          const { isInStock } = await ProductsService.verifyAmount({
            productId,
            amount: firstPlan.delta,
          });
          if (!isInStock) {
            setPending(productId, null);
            notify({ status: 'warning', title: 'Estoque insuficiente', duration: 1500 });
            return;
          }
        }

        // A comanda pode ter mudado (socket) durante o verifyAmount, então a
        // quantidade do servidor e o array de produtos são lidos de novo aqui.
        const currentCommand = commandRef.current;
        const serverAmount = findServerAmount();
        if (!currentCommand?._id || serverAmount === undefined) {
          setPending(productId, null);
          notify({ status: 'warning', title: 'O produto não está mais na comanda', duration: 2000 });
          return;
        }
        const { delta, operation } = planAmountChange(serverAmount, target);
        if (!operation) {
          setPending(productId, null);
          return;
        }

        const newProducts = currentCommand.products?.map((product: Product) =>
          product._id === productId ? { ...product, amount: target } : product
        );
        const { command: updatedCommand } = await CommandService.updateCommand({
          _id: currentCommand._id as string,
          products: newProducts,
        });
        commandRef.current = updatedCommand;
        if (isMountedRef.current) {
          setCommand(updatedCommand);
          productsDispatch({
            type: 'update-product-amount',
            payload: { product: { id: productId, amount: target } },
          });
        }

        // A comanda já foi gravada, então o pendente sai daqui mesmo se o
        // estoque falhar (o aviso de erro mostra o que aconteceu).
        if (pendingRef.current[productId] === target) setPending(productId, null);

        const { product: stockUpdatedProduct } =
          operation === 'diminish'
            ? await ProductsService.diminishAmount({ productId, amount: delta })
            : await ProductsService.increaseAmount({ productId, amount: delta });
        if (stockUpdatedProduct && isMountedRef.current) {
          stockProductsDispatch({
            type: 'UPDATE-ONE-PRODUCT',
            payload: { product: stockUpdatedProduct },
          });
        }
      } catch (err: any) {
        if (pendingRef.current[productId] === target) setPending(productId, null);
        notify({
          status: 'error',
          title: err?.response?.data?.message,
          duration: 1000,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productsDispatch, setCommand, setPending, stockProductsDispatch, notify]
  );

  const enqueueFlush = useCallback(
    (productId: string) => {
      queueRef.current = queueRef.current.then(() => flushAmountChange(productId));
    },
    [flushAmountChange]
  );

  const scheduleFlush = useCallback(
    (productId: string) => {
      clearTimeout(timersRef.current[productId]);
      timersRef.current[productId] = setTimeout(() => {
        enqueueFlush(productId);
      }, AMOUNT_CLICKS_DEBOUNCE_MS);
    },
    [enqueueFlush]
  );

  // Ao sair da tela com cliques ainda esperando, manda o que sobrou.
  useEffect(
    () => () => {
      Object.keys(timersRef.current).forEach((productId) => {
        clearTimeout(timersRef.current[productId]);
        if (pendingRef.current[productId] !== undefined) enqueueFlush(productId);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleIncrementProductAmount = useCallback(
    ({ productId, amount }: { productId: string; amount: number }) => {
      const current = pendingRef.current[productId] ?? amount;
      setPending(productId, current + 1);
      scheduleFlush(productId);
    },
    [scheduleFlush, setPending]
  );

  const handleDecrementProductAmount = useCallback(
    (product: AmountProduct) => {
      if (!isAdminRef.current) return;

      const productId = product._id;
      const current = pendingRef.current[productId] ?? product.amount;
      const newAmount = current - 1;

      if (newAmount < 0) {
        toast.closeAll();
        toast({
          status: 'error',
          duration: 1000,
          isClosable: true,
          title: 'Quantidade menor que 0',
        });
        return;
      }

      const newTotal = Math.round((newAmount * product.unitPrice + Number.EPSILON) * 100) / 100;
      if (newTotal < product.totalPayed) {
        toast.closeAll();
        toast({
          status: 'warning',
          title: 'Abaixando a quantidade, o total do produto seria menor do que já foi pago',
        });
        return;
      }

      setPending(productId, newAmount);
      scheduleFlush(productId);
    },
    [scheduleFlush, setPending, toast]
  );

  //
  // ==================== Command Filters Logic ==================== //
  //

  const handleToggleOrderByDir = useCallback(() => {
    setOrderByDir((prev: string) => (prev === 'asc' ? 'desc' : 'asc'));
  }, [setOrderByDir]);

  const filteredByFilter = useMemo(() => {
    const filtered = products?.value?.filter(
      ({ category }: { category: string }) => category === filter
    );
    return filter ? filtered : products.value;
  }, [filter, products.value]);

  const filteredBySearch = useMemo(() => {
    const filtered = filteredByFilter?.filter((product: any) => {
      const productValuesStr = normalizeSearch(Object.values(product).join(''));
      if (productValuesStr.includes(normalizeSearch(searchContent))) {
        return true;
      }
      return false;
    });
    return filtered;
  }, [filteredByFilter, searchContent]);

  const filteredBySort = useMemo(() => {
    const filtered = filteredBySearch?.sort((a: any, b: any) => {
      if (orderByDir === 'asc') {
        if (a[orderBy] < b[orderBy]) {
          return -1;
        }
        if (b[orderBy] < a[orderBy]) {
          return 1;
        }
        return 0;
      }

      if (a[orderBy] > b[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    });

    return filtered;
  }, [orderByDir, filteredBySearch, orderBy]);

  // Mostra a quantidade já com os cliques que ainda não foram pra API.
  const productsWithPendingAmounts = useMemo(
    () =>
      filteredBySort?.map((product: Product) =>
        pendingAmounts[product._id] === undefined
          ? product
          : { ...product, amount: pendingAmounts[product._id] }
      ),
    [filteredBySort, pendingAmounts]
  );

  return (
    <>
      <ProductsListLayout
        products={productsWithPendingAmounts}
        // handleIncrementProductAmount={handleIncrementProductAmount}
        // handleDecrementProductAmount={handleDecrementProductAmount}
        handleOpenDeleteModal={handleOpenDeleteModal}
        orderBy={orderBy}
        orderByDir={orderByDir}
        handleToggleOrderByDir={handleToggleOrderByDir}
        fishIdToEditAmount={fishIdToEditAmount}
        handleActiveEditFishAmount={handleActiveEditFishAmount}
        handleUpdateProductAmount={handleUpdateProductAmount}
        newProductAmount={newProductAmount}
        setNewProductAmount={setNewProductAmount}
        setFishIdToEditAmount={setFishIdToEditAmount}
        handleOpenPayProductModal={handleOpenPayProductModal}
        handleIncrementProductAmount={handleIncrementProductAmount}
        handleDecrementProductAmount={handleDecrementProductAmount}
        isAdmin={isAdmin}
      />
      <PayProductModal
        isModalOpen={isPayProductModalOpen}
        setIsModalOpen={setIsPayProductModalOpen}
        productToPay={productToPay}
      />
    </>
  );
};
