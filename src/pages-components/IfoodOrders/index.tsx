import { useCallback, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSound from 'use-sound';
import { SocketContext } from 'pages/_app';

import { IfoodOrder } from 'types/IfoodOrder';
import NotifySound from '../../../public/kitchenalarm.mp3';
import { IfoodOrdersLayout } from './layout';
import IfoodOrdersService from './services/IfoodOrdersService';

export const IfoodOrders = () => {
  const router = useRouter();
  const toast = useToast();
  const { socket } = useContext(SocketContext);
  const [playNotify] = useSound<any>(NotifySound);

  const [isAdmin, setIsAdmin] = useState(false);
  const [ifoodOrders, setIfoodOrders] = useState<IfoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const reloadIfoodOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const orders = await IfoodOrdersService.getAllPending();
      setIfoodOrders(orders);
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

  useEffect(() => {
    const onIfoodOrderReceived = (payload: IfoodOrder) => {
      setIfoodOrders((prev) => [payload, ...prev]);
      playNotify();
    };

    const onIfoodOrderUpdated = (payload: IfoodOrder) => {
      setIfoodOrders((prev) => prev.filter((order) => order._id !== payload._id));
    };

    socket.on('ifood-order-received', onIfoodOrderReceived);
    socket.on('ifood-order-updated', onIfoodOrderUpdated);

    return () => {
      socket.off('ifood-order-received', onIfoodOrderReceived);
      socket.off('ifood-order-updated', onIfoodOrderUpdated);
    };
  }, [socket, playNotify]);

  async function handleAccept(id: string) {
    try {
      setProcessingId(id);
      const { command } = await IfoodOrdersService.accept(id);
      router.push(`/command/${command._id}`);
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível aceitar o pedido no iFood.',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    try {
      setProcessingId(id);
      await IfoodOrdersService.reject(id);
      setIfoodOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível recusar o pedido no iFood.',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  }

  if (isAdmin) {
    return (
      <IfoodOrdersLayout
        ifoodOrders={ifoodOrders}
        isLoading={isLoading}
        processingId={processingId}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    );
  }

  return null;
};
