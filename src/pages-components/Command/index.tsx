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
    socket.on('kitchen-order-created', async (payload: any) => {
      if(payload.commandId === commandId){
        
        const { command: commandFound } = await CommandService.getOneCommand({
          commandId,
        });
        setCommand(commandFound);

        productsDispatch({
          type: 'add-products',
          payload: commandFound?.products,
        });

        setIsLoading(false);
      }
    });

    socket.on('command-updated', (updatedCommand: CommandType) => {
      if (updatedCommand._id === commandId) {
        setCommand(updatedCommand);

        productsDispatch({
          type: 'add-products',
          payload: updatedCommand?.products,
        });
      }
    });

    socket.on('command-deleted', (deletedCommandId: string) => {
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
    });

    socket.on('product-updated', (updatedProduct: Product) => {
      stockProductsDispatch({
        type: 'UPDATE-ONE-PRODUCT',
        payload: { product: updatedProduct },
      });
    });

    return () => {
      socket.off('command-updated');
      socket.off('command-deleted');
      socket.off('product-updated');
    };
  }, []);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdmin)
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

  const handlePrintCommand = useReactToPrint({
    content: () => {
      const printContent = document.createElement("div");
      const printHeader = document.createElement("div");
      const printFooter = document.createElement("div");

      const element1 = document.getElementById("commandName");
      const element2 = document.getElementById("commandPrice");

      const printInfo = document.createElement("div");
      
      const infoTitleName = document.createTextNode("Pesqueiro e Restaurante Arruda's")
      const infoTitleNameElement = document.createElement("span")
      infoTitleNameElement.appendChild(infoTitleName)
      infoTitleNameElement.style.alignItems = "center"
      infoTitleNameElement.style.display = "flex"
      infoTitleNameElement.style.fontSize = "18px"
      infoTitleNameElement.style.justifyContent = "center"

      printInfo.appendChild(infoTitleNameElement)


      const infoSubtitleName = document.createTextNode("Lanchonete Arrudas LTDA")
      const infoSubtitleNameElement = document.createElement("span")
      infoSubtitleNameElement.appendChild(infoSubtitleName)

      infoSubtitleNameElement.style.fontSize = "16px"

      printInfo.appendChild(infoSubtitleNameElement)


      const infoPhone = document.createTextNode("(11) 97231-1736")
      const infoPhoneElement = document.createElement("span")
      infoPhoneElement.appendChild(infoPhone)

      infoPhoneElement.style.fontSize = "16px"

      printInfo.appendChild(infoPhoneElement)


      const cnpjContainer = document.createElement("div")

      const infoCnpj = document.createTextNode("CNPJ: 13.521.007/0001-09")
      const infoCnpjElement = document.createElement("span")
      infoCnpjElement.appendChild(infoCnpj)

      cnpjContainer.appendChild(infoCnpjElement)

      const infoIE = document.createTextNode("IE: 623.032.562.119")
      const infoIEElement = document.createElement("span")
      infoIEElement.appendChild(infoIE)

      cnpjContainer.appendChild(infoIEElement)
      
      cnpjContainer.style.display = "flex"
      cnpjContainer.style.flexDirection = "column"
      cnpjContainer.style.fontSize = "14px"
      cnpjContainer.style.justifyContent = "space-between"
      cnpjContainer.style.marginBottom = "10px"
      cnpjContainer.style.marginLeft = "20px"
      cnpjContainer.style.marginRight = "50px"
      cnpjContainer.style.marginTop = "10px"

      printInfo.appendChild(cnpjContainer)

      printInfo.style.alignItems = "center"
      printInfo.style.display = "flex"
      printInfo.style.flexDirection = "column"
      printInfo.style.justifyContent = "center"
      printInfo.style.marginLeft = "20px"
      printInfo.style.marginRight = "50px"

      printContent.appendChild(printInfo)

      if (element1) {
        printHeader.appendChild(element1.cloneNode(true));
      }
      const currentDate = new Date()
      const opcoesFormatacao: DateTimeFormatOptions = { day: 'numeric', month: '2-digit', year: 'numeric' };
      const dataFormatada = currentDate.toLocaleDateString('pt-BR', opcoesFormatacao);


      const dayText = document.createTextNode(dataFormatada);
      const dayElement = document.createElement("span")
      dayElement.appendChild(dayText)

      const dateElement = document.createElement("div")
      dateElement.style.display = "flex"
      dateElement.style.flexDirection = "column"
      dateElement.style.alignItems = "end"
      dateElement.style.justifyContent = "center"


      let horas : number | string = currentDate.getHours();
      let minutos : number | string = currentDate.getMinutes();

      // Formatar para garantir que tenham dois dígitos
      horas = horas < 10 ? `0${  horas}` : horas;
      minutos = minutos < 10 ? `0${  minutos}` : minutos;
      const horaFormatada = `${horas}:${minutos}`;
      
      const hourText = document.createTextNode(horaFormatada);
      const hourElement = document.createElement("span");
      hourElement.appendChild(hourText);

      
      if(dateElement){
        dateElement.appendChild(dayElement)
        dateElement.appendChild(hourElement)
      }

      printHeader.appendChild(dateElement.cloneNode(true));

      
      printHeader.style.display = "flex"
      printHeader.style.flexDirection = "row"
      printHeader.style.justifyContent = "space-between"
      printHeader.style.marginLeft = "20px"
      printHeader.style.marginRight = "50px"
      printHeader.style.fontSize = "16px"
      printHeader.style.fontFamily = "Monospace"
      printHeader.style.fontWeight = "700"
      printContent.appendChild(printHeader.cloneNode(true));

      const productsBody = document.createElement("div")
      
      const linhas = products.value.map((element) => {
        const productRow = document.createElement("div")

        // Criando um elemento de célula (td) e adicionando o texto do elemento
        const productName = document.createTextNode(`${element.name  }`)
        const productNameElement = document.createElement("span")
        productNameElement.appendChild(productName)

        const productQuantity = document.createTextNode(`${element.amount  }x`)
        const productQuantityElement = document.createElement("span")
        productQuantityElement.appendChild(productQuantity)

        const productPrice = document.createTextNode(`R$ ${element.unitPrice  } |`)
        const productPriceElement = document.createElement("span")
        productPriceElement.appendChild(productPrice)

        productNameElement.style.maxWidth = "100px"
        productNameElement.style.width = "100%"

        productNameElement.style.lineHeight = "1.2"

        // Adicionando a célula à linha
        productRow.appendChild(productQuantityElement);
        productRow.appendChild(productNameElement);
        productRow.appendChild(productPriceElement);

        productRow.style.marginTop = "10px"
        productRow.style.marginBottom = "10px"

        productRow.style.display = "flex"
        productRow.style.justifyContent = "space-between"

        return productRow;
      })

      linhas.forEach((linha) => {
          productsBody.style.fontSize = "14px";
          productsBody.style.marginLeft = "20px";
          productsBody.style.marginRight = "50px";
          productsBody.appendChild(linha);
      });

      if(productsBody){
        printContent.appendChild(productsBody)
      }
      
      if (element2) {
        printFooter.appendChild(element2.cloneNode(true));
        printFooter.style.display = "flex"
        printFooter.style.flexDirection = "column"
        printFooter.style.alignItems = "start"
        printFooter.style.justifyContent = "end"
        printFooter.style.marginLeft = "200px"
        printFooter.style.width = "100px"
        printFooter.style.marginBottom = "50px"
        printContent.appendChild(printFooter.cloneNode(true));
      }

      printContent.style.fontFamily = "Monospace"
      printContent.style.paddingBottom = '10px'
      printContent.style.borderBottom = '1px solid black'

      return printContent;
    },
    documentTitle: `${command.table}_comanda`
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
