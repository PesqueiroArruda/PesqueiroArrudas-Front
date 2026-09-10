/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import { useToast } from '@chakra-ui/react';
import { Command as CommandType } from 'types/Command';
import { useRouter } from 'next/router';
import { Product } from 'types/Product';
import { SocketContext } from 'pages/_app';
import { useReactToPrint } from 'react-to-print';
import { DateTimeFormatOptions } from 'luxon';
import { parseToBRL } from 'utils/parseToBRL';
import { productsReducer } from './reducers/productsReducer';
import { AddProductModal } from './components/AddProductModal';
import { DeleteProductModal } from './components/DeleteProductModal';
import { CommandLayout } from './layout';
import CommandService from './services/CommandService';
import { PaymentModal } from './components/PaymentModal';
import ProductsService from './services/ProductsService';
import { stockProductsReducer } from './reducers/stockProductsReducer';
import { DeleteCommandModal } from './components/DeleteCommandModal';
import { SendToKitchenModal } from './components/SendToKitchenModal';
import { CloseCommandModal } from './components/CloseCommandModal';
import { DiscountModal } from './components/DiscountModal';

interface StockProductsAction {
  type:
    | 'ADD-ALL-PRODUCTS'
    | 'UPDATE-ONE-PRODUCT'
    | 'FAVORITE-PRODUCT'
    | 'UNFAVORITE-PRODUCT';
  payload: any;
}

interface ContextProps {
  products: { value: any[] };
  productsDispatch: any;
  isDeleteProductModalOpen: boolean;
  setIsDeleteProductModalOpen: Dispatch<SetStateAction<boolean>>;
  productIdToDelete: string;
  setProductIdToDelete: Dispatch<SetStateAction<string>>;
  setIsAddProductModalOpen: Dispatch<SetStateAction<boolean>>;
  handleOpenDeleteModal: ({ productId }: { productId: string }) => void;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  orderByDir: 'asc' | 'desc';
  setOrderByDir: Dispatch<SetStateAction<'asc' | 'desc'>>;
  searchContent: string;
  setSearchContent: Dispatch<SetStateAction<string>>;
  command: CommandType;
  setCommand: Dispatch<SetStateAction<CommandType>>;
  stockProductsDispatch: Dispatch<StockProductsAction>;
}

export const CommandContext = createContext({} as ContextProps);

interface Props {
  commandId: string | string[] | undefined;
}

const initialState = {
  value: [] as Product[],
};

export const Command = ({ commandId }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [command, setCommand] = useState<CommandType>({} as CommandType);
  const [products, productsDispatch] = useReducer(
    productsReducer,
    initialState
  );
  const [isLoading, setIsLoading] = useState(true);

  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteCommandModalOpen, setIsDeleteCommandModalOpen] =
    useState(false);
  const [isSendToKitchenModalOpen, setIsSendToKitchenModalOpen] =
    useState(false);
  const [isCloseCommandModalOpen, setIsCloseCommandModalOpen] = useState(false);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const [filter, setFilter] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [orderByDir, setOrderByDir] = useState('' as 'asc' | 'desc');
  const [searchContent, setSearchContent] = useState('');

  const [stockProducts, stockProductsDispatch] = useReducer(
    stockProductsReducer,
    { value: [] as Product[] }
  );

  const { socket } = useContext(SocketContext);

  const router = useRouter();
  const toast = useToast();

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
        // Grab command informations from database
        const { command: commandFound } = await CommandService.getOneCommand({
          commandId,
        });
        setCommand(commandFound);

        productsDispatch({
          type: 'add-products',
          payload: commandFound?.products,
        });

        setIsLoading(false);
        toast.closeAll();
      } catch (error: any) {
        toast({
          status: 'error',
          title: error?.response?.data?.message,
          duration: 2000,
          isClosable: true,
        });
      }
    })();
  }, [commandId, toast]);

  // useEffect to load all of stock products to populate addProductModal
  useEffect(() => {
    (async () => {
      const allProducts = await ProductsService.getAllProducts();
      stockProductsDispatch({ type: 'ADD-ALL-PRODUCTS', payload: allProducts });
    })();
  }, []);

  useEffect(() => {
    let active = true;
    const onKitchenOrderCreated = async (payload: any) => {
      if (payload.commandId !== commandId) return;
      try {
        const { command: commandFound } = await CommandService.getOneCommand({
          commandId,
        });
        if (active) {
          setCommand(commandFound);
          productsDispatch({
            type: 'add-products',
            payload: commandFound?.products,
          });
          setIsLoading(false);
        }
      } catch {
        if (active) {
          toast({ status: 'error', title: 'Unable to refresh the command.' });
        }
      }
    };
    socket.on('kitchen-order-created', onKitchenOrderCreated);

    const onCommandUpdated = (updatedCommand: CommandType) => {
      if (updatedCommand._id === commandId) {
        setCommand(updatedCommand);

        productsDispatch({
          type: 'add-products',
          payload: updatedCommand?.products,
        });
      }
    };
    socket.on('command-updated', onCommandUpdated);

    const onCommandDeleted = (deletedCommandId: string) => {
      if (deletedCommandId === commandId) {
        toast.closeAll();
        toast({
          status: 'success',
          title: 'Comanda deletada',
          duration: 1000,
          isClosable: true,
        });
        router.push('/commands');
      }
    };
    socket.on('command-deleted', onCommandDeleted);

    const onProductUpdated = (updatedProduct: Product) => {
      stockProductsDispatch({
        type: 'UPDATE-ONE-PRODUCT',
        payload: { product: updatedProduct },
      });
    };
    socket.on('product-updated', onProductUpdated);

    return () => {
      active = false;
      socket.off('kitchen-order-created', onKitchenOrderCreated);
      socket.off('command-updated', onCommandUpdated);
      socket.off('command-deleted', onCommandDeleted);
      socket.off('product-updated', onProductUpdated);
    };
  }, [commandId, router, socket, toast]);

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);
  }, [router]);

  const handleOpenDeleteModal = useCallback(
    ({ productId }: { productId: string }) => {
      setProductIdToDelete(productId);
      setIsDeleteProductModalOpen(true);
    },
    []
  );

  const handleOpenPaymentModal = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);

  const handleOpenSentToKitchenModal = useCallback(() => {
    setIsSendToKitchenModalOpen(true);
  }, []);

  const handleOpenCloseCommandModal = useCallback(() => {
    setIsCloseCommandModalOpen(true);
  }, []);

  const handleGoToCommands = useCallback(() => {
    router.back();
  }, [router]);

  const handleDeleteCommand = useCallback(() => {
    setIsDeleteCommandModalOpen(true);
  }, []);

  const handleEditDiscount = useCallback(() => {
    setIsDiscountModalOpen(true);
  }, []);

  const handleUpdatePeopleCount = useCallback(
    async (peopleCount: number) => {
      if (peopleCount < 1) return;
      try {
        const data = await CommandService.updateCommandPeopleCount({
          _id: command._id as string,
          peopleCount,
        });
        setCommand(data.command);
      } catch (error: any) {
        toast({
          status: 'error',
          title: error?.response?.data?.message || 'Não foi possível atualizar a quantidade de pessoas.',
          duration: 2000,
          isClosable: true,
        });
      }
    },
    [command._id, toast]
  );

  const handlePrintCommand = useReactToPrint({
    content: () => {
      // Recibo dimensionado para bobina térmica de 58mm.
      const printContent = document.createElement('div');
      printContent.style.width = '58mm';
      printContent.style.boxSizing = 'border-box';
      printContent.style.padding = '2mm';
      printContent.style.fontFamily = 'Monospace';
      printContent.style.fontSize = '11px';
      printContent.style.lineHeight = '1.35';
      printContent.style.color = '#000';

      const createDivider = () => {
        const divider = document.createElement('div');
        divider.style.borderTop = '1px dashed #000';
        divider.style.margin = '6px 0';
        return divider;
      };

      const createRow = (
        label: string,
        value: string,
        opts: { bold?: boolean; fontSize?: string } = {}
      ) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.gap = '8px';
        if (opts.bold) row.style.fontWeight = '700';
        if (opts.fontSize) row.style.fontSize = opts.fontSize;

        const labelElement = document.createElement('span');
        labelElement.textContent = label;

        const valueElement = document.createElement('span');
        valueElement.textContent = value;
        valueElement.style.whiteSpace = 'nowrap';

        row.appendChild(labelElement);
        row.appendChild(valueElement);
        return row;
      };

      // Cabeçalho do estabelecimento
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '4px';

      const businessName = document.createElement('div');
      businessName.textContent = "Pesqueiro e Restaurante Arruda's";
      businessName.style.fontSize = '13px';
      businessName.style.fontWeight = '700';
      header.appendChild(businessName);

      const businessSubtitle = document.createElement('div');
      businessSubtitle.textContent = 'Lanchonete Arrudas LTDA';
      header.appendChild(businessSubtitle);

      const businessPhone = document.createElement('div');
      businessPhone.textContent = '(11) 97231-1736';
      header.appendChild(businessPhone);

      const businessDocs = document.createElement('div');
      businessDocs.style.fontSize = '9px';
      businessDocs.style.marginTop = '2px';
      businessDocs.textContent = 'CNPJ: 13.521.007/0001-09 | IE: 623.032.562.119';
      header.appendChild(businessDocs);

      printContent.appendChild(header);
      printContent.appendChild(createDivider());

      // Mesa e data/hora
      const currentDate = new Date();
      const opcoesFormatacao: DateTimeFormatOptions = {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric',
      };
      const dataFormatada = currentDate.toLocaleDateString('pt-BR', opcoesFormatacao);
      const horas = String(currentDate.getHours()).padStart(2, '0');
      const minutos = String(currentDate.getMinutes()).padStart(2, '0');

      printContent.appendChild(
        createRow(`Mesa: ${command?.table || ''}`, `${dataFormatada} ${horas}:${minutos}`, { bold: true })
      );
      printContent.appendChild(createDivider());

      // Produtos
      products.value.forEach((product) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.gap = '6px';
        row.style.marginBottom = '4px';

        const nameElement = document.createElement('span');
        nameElement.textContent = `${product.amount}x ${product.name}`;
        nameElement.style.flex = '1';
        nameElement.style.wordBreak = 'break-word';

        const priceElement = document.createElement('span');
        priceElement.textContent = parseToBRL(product.unitPrice || 0);
        priceElement.style.whiteSpace = 'nowrap';

        row.appendChild(nameElement);
        row.appendChild(priceElement);
        printContent.appendChild(row);
      });

      printContent.appendChild(createDivider());

      // Resumo de valores
      const totalValue = command?.total || 0;
      const discountValue = command?.discount || 0;
      const paidValue = command?.totalPayed || 0;
      const finalValue = Math.round((totalValue - discountValue + Number.EPSILON) * 100) / 100;
      const tempAPagar = Math.round((finalValue - paidValue + Number.EPSILON) * 100) / 100;
      const aPagar = tempAPagar > 0 ? tempAPagar : 0;

      printContent.appendChild(createRow('Valor Total:', parseToBRL(totalValue)));
      printContent.appendChild(createRow('Desconto:', parseToBRL(discountValue)));
      printContent.appendChild(createRow('Valor Final:', parseToBRL(finalValue)));
      printContent.appendChild(createDivider());
      printContent.appendChild(createRow('A Pagar:', parseToBRL(aPagar), { bold: true, fontSize: '13px' }));

      return printContent;
    },
    documentTitle: `${command.table}_comanda`,
  });

  const tempTotalToBePayed =
    Math.round(
      ((command?.total || 0) -
        (command?.totalPayed || 0) -
        (command?.discount || 0) +
        Number.EPSILON) *
        100
    ) / 100;
  const totalToBePayed = tempTotalToBePayed > 0 ? tempTotalToBePayed : 0;

  return (
    <CommandContext.Provider
      value={{
        command,
        setCommand,
        productsDispatch,
        products,
        isDeleteProductModalOpen,
        setIsDeleteProductModalOpen,
        setIsAddProductModalOpen,
        productIdToDelete,
        setProductIdToDelete,
        handleOpenDeleteModal,
        filter,
        setFilter,
        orderBy,
        setOrderBy,
        orderByDir,
        setOrderByDir,
        searchContent,
        setSearchContent,
        stockProductsDispatch,
      }}
    >
      <CommandLayout
        command={command}
        isLoading={isLoading}
        handleGoToCommands={handleGoToCommands}
        handleOpenPaymentModal={handleOpenPaymentModal}
        handleDeleteCommand={handleDeleteCommand}
        handleOpenSentToKitchenModal={handleOpenSentToKitchenModal}
        handleOpenCloseCommandModal={handleOpenCloseCommandModal}
        handleEditDiscount={handleEditDiscount}
        totalToBePayed={totalToBePayed}
        handlePrintCommand={handlePrintCommand}
        isAdmin={isAdmin}
        handleUpdatePeopleCount={handleUpdatePeopleCount}
      />
      <DeleteProductModal
        isModalOpen={isDeleteProductModalOpen}
        setIsModalOpen={setIsDeleteProductModalOpen}
      />
      <DeleteCommandModal
        isModalOpen={isDeleteCommandModalOpen}
        setIsModalOpen={setIsDeleteCommandModalOpen}
        command={command}
      />
      <AddProductModal
        isModalOpen={isAddProductModalOpen}
        setIsModalOpen={setIsAddProductModalOpen}
        commandId={command?._id}
        setCommand={setCommand}
        allProducts={stockProducts.value}
        allProductsDispatch={stockProductsDispatch}
      />
      <PaymentModal
        isModalOpen={isPaymentModalOpen}
        setIsModalOpen={setIsPaymentModalOpen}
        setIsCloseCommandModalOpen={setIsCloseCommandModalOpen}
      />
      <CloseCommandModal
        isModalOpen={isCloseCommandModalOpen}
        setIsModalOpen={setIsCloseCommandModalOpen}
      />
      <SendToKitchenModal
        isModalOpen={isSendToKitchenModalOpen}
        setIsModalOpen={setIsSendToKitchenModalOpen}
      />
      <DiscountModal
        isModalOpen={isDiscountModalOpen}
        setIsModalOpen={setIsDiscountModalOpen}
      />
    </CommandContext.Provider>
  );
};
