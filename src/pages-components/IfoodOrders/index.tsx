import { useCallback, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSound from 'use-sound';
import { SocketContext } from 'pages/_app';

import { IfoodCancellationReason, IfoodOrder, ResolvedIfoodItem } from 'types/IfoodOrder';
import { Product } from 'types/Product';
import { IfoodProductMapping } from 'types/IfoodProductMapping';
import ProductsService from 'pages-components/Commands/services/ProductsService';
import { resolveIfoodItemProduct } from 'utils/resolveIfoodItemProduct';
import NotifySound from '../../../public/kitchenalarm.mp3';
import { IfoodOrdersLayout } from './layout';
import IfoodOrdersService from './services/IfoodOrdersService';

interface ItemSelection {
  productId: string | null;
  saveMapping: boolean;
}

// selections[orderId][itemId]
type SelectionsState = Record<string, Record<string, ItemSelection>>;

export const IfoodOrders = () => {
  const router = useRouter();
  const toast = useToast();
  const { socket } = useContext(SocketContext);
  const [playNotify] = useSound<any>(NotifySound);

  const [isAdmin, setIsAdmin] = useState(false);
  const [ifoodOrders, setIfoodOrders] = useState<IfoodOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [mappings, setMappings] = useState<IfoodProductMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selections, setSelections] = useState<SelectionsState>({});

  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [cancellationReasons, setCancellationReasons] = useState<IfoodCancellationReason[]>([]);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);

  const reloadIfoodOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const [orders, allProducts, allMappings] = await Promise.all([
        IfoodOrdersService.getAllPending(),
        ProductsService.getAllProducts(),
        IfoodOrdersService.getProductMappings(),
      ]);
      setIfoodOrders(orders);
      setProducts(allProducts);
      setMappings(allMappings);
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Não foi possível carregar os pedidos do iFood.',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    reloadIfoodOrders();
  }, [reloadIfoodOrders]);

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);

    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  // Inicializa a resolução de cada item (vínculo salvo ou nome batendo exato)
  // só na primeira vez que o pedido aparece — não sobrescreve o que o
  // atendente já escolheu manualmente.
  useEffect(() => {
    if (products.length === 0) return;

    setSelections((prev) => {
      let changed = false;
      const next = { ...prev };

      ifoodOrders.forEach((order) => {
        if (next[order._id] || !order.rawPayload?.items) return;
        changed = true;
        const orderSelections: Record<string, ItemSelection> = {};
        order.rawPayload.items.forEach((item) => {
          orderSelections[item.id] = {
            productId: resolveIfoodItemProduct(item, products, mappings),
            saveMapping: true,
          };
        });
        next[order._id] = orderSelections;
      });

      return changed ? next : prev;
    });
  }, [ifoodOrders, products, mappings]);

  useEffect(() => {
    const onIfoodOrderReceived = (payload: IfoodOrder) => {
      setIfoodOrders((prev) => {
        if (prev.some((order) => order._id === payload._id)) return prev;
        return [payload, ...prev];
      });
      playNotify();
    };

    const onIfoodOrderUpdated = (payload: IfoodOrder) => {
      setIfoodOrders((prev) => {
        if (payload.status === 'pending' || payload.status === 'cancellation_requested') {
          const exists = prev.some((order) => order._id === payload._id);
          if (exists) {
            return prev.map((order) => (order._id === payload._id ? payload : order));
          }
          return [payload, ...prev];
        }
        return prev.filter((order) => order._id !== payload._id);
      });
    };

    socket.on('ifood-order-received', onIfoodOrderReceived);
    socket.on('ifood-order-updated', onIfoodOrderUpdated);

    return () => {
      socket.off('ifood-order-received', onIfoodOrderReceived);
      socket.off('ifood-order-updated', onIfoodOrderUpdated);
    };
  }, [socket, playNotify]);

  const handleSelectProduct = useCallback((orderId: string, itemId: string, productId: string) => {
    setSelections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemId]: {
          productId: productId || null,
          saveMapping: prev[orderId]?.[itemId]?.saveMapping ?? true,
        },
      },
    }));
  }, []);

  const handleToggleSaveMapping = useCallback((orderId: string, itemId: string, saveMapping: boolean) => {
    setSelections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemId]: {
          productId: prev[orderId]?.[itemId]?.productId ?? null,
          saveMapping,
        },
      },
    }));
  }, []);

  async function handleAccept(id: string) {
    const order = ifoodOrders.find((o) => o._id === id);
    if (!order?.rawPayload?.items) return;

    const orderSelections = selections[id] || {};
    const items: ResolvedIfoodItem[] = order.rawPayload.items.map((item) => ({
      ifoodItemId: item.id,
      externalCode: item.externalCode,
      ifoodItemName: item.name,
      quantity: item.quantity,
      unitPrice: Math.round((item.totalPrice / item.quantity + Number.EPSILON) * 100) / 100,
      productId: orderSelections[item.id]?.productId ?? null,
      saveMapping: orderSelections[item.id]?.saveMapping ?? true,
    }));

    try {
      setProcessingId(id);
      const { command } = await IfoodOrdersService.accept(id, items);
      router.push(`/command/${command._id}`);
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível aceitar o pedido no iFood.',
        duration: null,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleOpenRejectModal(id: string) {
    setRejectingOrderId(id);
    setSelectedReasonIndex(null);
    setIsLoadingReasons(true);
    try {
      const reasons = await IfoodOrdersService.getCancellationReasons(id);
      setCancellationReasons(reasons);
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Não foi possível buscar os motivos de recusa no iFood.',
        duration: 3000,
        isClosable: true,
      });
      setRejectingOrderId(null);
    } finally {
      setIsLoadingReasons(false);
    }
  }

  function handleCloseRejectModal() {
    setRejectingOrderId(null);
    setCancellationReasons([]);
    setSelectedReasonIndex(null);
  }

  async function handleConfirmReject() {
    if (!rejectingOrderId || selectedReasonIndex === null) return;
    const reason = cancellationReasons[selectedReasonIndex];

    try {
      setProcessingId(rejectingOrderId);
      await IfoodOrdersService.reject(rejectingOrderId, reason.cancelCodeId, reason.description);
      setIfoodOrders((prev) => prev.filter((order) => order._id !== rejectingOrderId));
      handleCloseRejectModal();
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível recusar o pedido no iFood.',
        duration: null,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAcceptCancellation(id: string) {
    try {
      setProcessingId(id);
      await IfoodOrdersService.acceptCancellation(id);
      setIfoodOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível confirmar o cancelamento no iFood.',
        duration: null,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDenyCancellation(id: string) {
    try {
      setProcessingId(id);
      await IfoodOrdersService.denyCancellation(id, 'Pedido já está em preparo');
      await reloadIfoodOrders();
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível negar o cancelamento no iFood.',
        duration: null,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  function handleGoToCommand(commandId: string) {
    router.push(`/command/${commandId}`);
  }

  if (isAdmin) {
    return (
      <IfoodOrdersLayout
        ifoodOrders={ifoodOrders}
        products={products}
        selections={selections}
        isLoading={isLoading}
        processingId={processingId}
        handleAccept={handleAccept}
        handleOpenRejectModal={handleOpenRejectModal}
        handleSelectProduct={handleSelectProduct}
        handleToggleSaveMapping={handleToggleSaveMapping}
        handleAcceptCancellation={handleAcceptCancellation}
        handleDenyCancellation={handleDenyCancellation}
        handleGoToCommand={handleGoToCommand}
        rejectingOrderId={rejectingOrderId}
        cancellationReasons={cancellationReasons}
        selectedReasonIndex={selectedReasonIndex}
        isLoadingReasons={isLoadingReasons}
        handleSelectReason={setSelectedReasonIndex}
        handleConfirmReject={handleConfirmReject}
        handleCloseRejectModal={handleCloseRejectModal}
      />
    );
  }

  return null;
};
