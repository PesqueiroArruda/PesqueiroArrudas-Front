import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SocketContext } from 'pages/_app';
import { useContext, useEffect, useMemo, useState } from 'react';
import WaiterService, {
  WaiterCommand,
  WaiterProduct,
} from '../services/WaiterService';
import { isOutsideNetworkError } from '../WaiterShell';
import { WaiterCommandLayout } from './layout';
import { availableStock } from './stock';

export const WaiterCommandPage = ({ commandId }: { commandId?: string }) => {
  const [command, setCommand] = useState<WaiterCommand | null>(null);
  const [products, setProducts] = useState<WaiterProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOutsideNetwork, setIsOutsideNetwork] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [observation, setObservation] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [isSending, setIsSending] = useState(false);

  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!commandId) return;

    (async () => {
      try {
        const [loadedCommand, loadedProducts] = await Promise.all([
          WaiterService.getCommand(commandId),
          WaiterService.getProducts(),
        ]);
        setCommand(loadedCommand);
        setProducts(loadedProducts);
      } catch (error: any) {
        if (isOutsideNetworkError(error)) setIsOutsideNetwork(true);
        else {
          toast({
            status: 'error',
            title: error?.response?.data?.message || 'Não foi possível abrir a comanda.',
          });
          router.push('/garcom');
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandId]);

  useEffect(() => {
    const onCommandUpdated = (updated: WaiterCommand) => {
      if (updated._id === commandId) setCommand(updated);
    };
    const onProductUpdated = (updated: WaiterProduct) =>
      setProducts((prev) => prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));

    socket.on('command-updated', onCommandUpdated);
    socket.on('product-updated', onProductUpdated);
    return () => {
      socket.off('command-updated', onCommandUpdated);
      socket.off('product-updated', onProductUpdated);
    };
  }, [socket, commandId]);

  const categories = useMemo(() => {
    const names = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ) as string[];
    return ['Todos', ...names.sort((a, b) => a.localeCompare(b, 'pt-BR'))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      if (category !== 'Todos' && product.category !== category) return false;
      return !term || product.name.toLowerCase().includes(term);
    });
  }, [products, search, category]);

  function setQuantity(product: WaiterProduct, quantity: number) {
    const stock = availableStock(product);
    const limited = stock === null ? quantity : Math.min(quantity, stock);
    setCart((prev) => {
      const next = { ...prev };
      if (!Number.isFinite(limited) || limited <= 0) delete next[product._id];
      else next[product._id] = Math.round(limited * 1000) / 1000;
      return next;
    });
  }

  const cartEntries = Object.entries(cart);
  const cartItemCount = cartEntries.length;

  async function handleSend() {
    if (!commandId || isSending || cartItemCount === 0) return;

    setIsSending(true);
    const failures: string[] = [];
    const remaining = { ...cart };
    let leftNetwork = false;

    // Um item por vez: o servidor baixa estoque e avisa cozinha/bar em cada um.
    // eslint-disable-next-line no-restricted-syntax
    for (const [productId, amount] of cartEntries) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const updated = await WaiterService.addItem(commandId, {
          productId,
          amount,
          observation: observation.trim() || undefined,
        });
        setCommand(updated);
        delete remaining[productId];
      } catch (error: any) {
        if (isOutsideNetworkError(error)) {
          setIsOutsideNetwork(true);
          leftNetwork = true;
          break;
        }
        const name = products.find((item) => item._id === productId)?.name || 'Item';
        failures.push(`${name}: ${error?.response?.data?.message || 'não foi possível adicionar'}`);
      }
    }

    setCart(remaining);
    setIsSending(false);
    toast.closeAll();

    // Saiu da rede do pesqueiro no meio do envio: o que sobrou fica no carrinho.
    if (leftNetwork) return;

    if (failures.length > 0) {
      toast({ status: 'error', title: failures.join(' | '), duration: 6000, isClosable: true });
      return;
    }

    setObservation('');
    toast({ status: 'success', title: 'Pedido enviado!', duration: 1500 });
  }

  return (
    <WaiterCommandLayout
      command={command}
      products={visibleProducts}
      categories={categories}
      category={category}
      setCategory={setCategory}
      search={search}
      setSearch={setSearch}
      cart={cart}
      setQuantity={setQuantity}
      observation={observation}
      setObservation={setObservation}
      isLoading={isLoading}
      isSending={isSending}
      isOutsideNetwork={isOutsideNetwork}
      handleSend={handleSend}
      handleBack={() => router.push('/garcom')}
    />
  );
};
