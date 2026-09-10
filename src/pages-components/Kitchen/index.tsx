/* eslint-disable react/jsx-no-constructed-context-values */
import { useToast } from '@chakra-ui/react';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useSound from 'use-sound';
import { SocketContext } from 'pages/_app';

import { Order } from 'types/Order';
import { animateScroll } from 'react-scroll';
import { useRouter } from 'next/router';
import { KitchenLayout } from './layout';
import { allOrdersReducer } from './reducers/allOrdersReducer';
import KitchenOrdersService from './services/KitchenOrdersService';
import { KitchenContextProps } from './types/KitchenContext';

import NotifySound from '../../../public/kitchenalarm.mp3';
import { CheckOrderModal } from './components/CheckOrderModal';

export const KitchenContext = createContext({} as KitchenContextProps);

type Cat = 'kitchen' | 'bar';

function reconcileOrder(idsLocal: string[], idsAtuais: string[]) {
  const setAtuais = new Set(idsAtuais);
  // 1) remove o que não existe mais
  const filtrado = idsLocal.filter((id) => setAtuais.has(id));
  // 2) adiciona os novos ao final
  const novos = idsAtuais.filter((id) => !idsLocal.includes(id));
  return [...filtrado, ...novos];
}

export const Kitchen = () => {
  const router = useRouter();
  const [isCheckOrderModalOpen, setIsCheckOrderModalOpen] = useState(false);
  const [orderToCheck, setOrderToCheck] = useState<Order>({} as Order);

  const [allOrders, allOrdersDispatch] = useReducer(allOrdersReducer, {
    value: [] as Order[],
  });

  const latestOrdersRef = useRef<Order[]>([]);
  useEffect(() => {
    latestOrdersRef.current = allOrders.value;
  }, [allOrders.value]);

  const [playSound, setPlaySound] = useState(false);
  const [isKitchen, setIsKitchen] = useState(true);

  const { socket } = useContext(SocketContext);
  const toast = useToast();
  const [playNotify] = useSound<any>(NotifySound);

  // 🔹 ORDEM LOCAL (por categoria) — pode opcionalmente persistir em localStorage
  const [frontOrderByCategory, setFrontOrderByCategory] = useState<
    Record<Cat, string[]>
  >({
    kitchen: [],
    bar: [],
  });

  // ✅ arrow-body-style: retorno implícito
  const getIdsPorCategoria = useCallback(
    (cat: Cat, orders: Order[]) =>
      orders
        .filter((o) => !o.isMade && o.orderCategory === cat)
        .map((o) => o._id),
    []
  );

  const applyReconcile = useCallback(
    (orders: Order[]) => {
      const idsKitchen = getIdsPorCategoria('kitchen', orders);
      const idsBar = getIdsPorCategoria('bar', orders);

      setFrontOrderByCategory((prev) => ({
        kitchen: reconcileOrder(prev.kitchen, idsKitchen),
        bar: reconcileOrder(prev.bar, idsBar),
      }));
    },
    [getIdsPorCategoria]
  );

  // << refetch centralizado
  const reloadOrders = useCallback(async () => {
    const orders = await KitchenOrdersService.getAll();
    allOrdersDispatch({ type: 'ADD-ORDERS', payload: orders });
    applyReconcile(orders); // 🔸 mantém a ordem local coerente
  }, [applyReconcile]);

  useEffect(() => {
    const hasCleanedAuthStorage = localStorage.getItem(
      'hasCleanedAuthStorage_v1'
    );

    if (!hasCleanedAuthStorage) {
      localStorage.removeItem('isLogged');
      localStorage.removeItem('isUser');

      localStorage.setItem('hasCleanedAuthStorage_v1', 'true');

      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await reloadOrders(); // << usa o refetch centralizado
      } catch (error: any) {
        toast({
          status: 'error',
          title: 'Recarregue a página',
          duration: 2000,
          isClosable: true,
        });
        console.error('reloadOrders (initial) failed:', error);
      }
    })();
  }, [reloadOrders, toast]);

  useEffect(() => {
    const onKitchenOrderCreated = (payload: Order) => {
      allOrdersDispatch({
        type: 'ADD-ONE-ORDER',
        payload: { order: payload },
      });
      applyReconcile([...latestOrdersRef.current, payload]);
      animateScroll.scrollToBottom();
      if (payload.orderCategory === 'kitchen') setPlaySound(true);
    };

    const refreshOrders = () => {
      reloadOrders().catch(() => {
        toast({
          status: 'error',
          title: 'Unable to refresh kitchen orders.',
          isClosable: true,
        });
      });
    };

    const onKitchenOrderUpdated = (payload: Order[]) => {
      const updated = payload?.[0];
      if (updated) {
        allOrdersDispatch({
          type: updated.isMade ? 'REMOVE-ONE-ORDER' : 'UPDATE-ONE-PRODUCT',
          payload: { order: updated },
        });
      }
      refreshOrders();
    };

    const onKitchenOrderDeleted = (payload: { commandId: string }) => {
      allOrdersDispatch({
        type: 'REMOVE-COMMAND-ORDERS',
        payload: { commandId: payload.commandId },
      });
      refreshOrders();
    };

    socket.on('kitchen-order-created', onKitchenOrderCreated);
    socket.on('kitchen-order-updated', onKitchenOrderUpdated);
    socket.on('kitchen-order-deleted', onKitchenOrderDeleted);
    socket.on('kitchen-orders-reordered', refreshOrders);

    return () => {
      socket.off('kitchen-order-created', onKitchenOrderCreated);
      socket.off('kitchen-order-updated', onKitchenOrderUpdated);
      socket.off('kitchen-order-deleted', onKitchenOrderDeleted);
      socket.off('kitchen-orders-reordered', refreshOrders);
    };
  }, [socket, toast, reloadOrders, applyReconcile]);

  useEffect(() => {
    if (playSound) {
      playNotify();
      setPlaySound(false);
    }
  }, [playSound, playNotify]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      router.push('/commands');
    }
  }, [router]);

  // 🔸 useMemo para não recriar o objeto do Provider a cada render
  const contextValue = useMemo(
    () => ({
      allOrders: allOrders.value,
      allOrdersDispatch, // dispatch é estável
      setIsCheckOrderModalOpen,
      setOrderToCheck,
      isKitchen,
      setIsKitchen,
      reloadOrders,
      frontOrderByCategory,
      setFrontOrderByCategory,
    }),
    [
      allOrders.value,
      isKitchen,
      reloadOrders,
      frontOrderByCategory,
      // setters/dispatch são estáveis, não precisariam entrar nas deps
      allOrdersDispatch,
      setIsCheckOrderModalOpen,
      setOrderToCheck,
      setIsKitchen,
      setFrontOrderByCategory,
    ]
  );

  return (
    <KitchenContext.Provider value={contextValue}>
      <KitchenLayout orders={allOrders.value} />
      <CheckOrderModal
        isModalOpen={isCheckOrderModalOpen}
        setIsModalOpen={setIsCheckOrderModalOpen}
        order={orderToCheck}
      />
    </KitchenContext.Provider>
  );
};
