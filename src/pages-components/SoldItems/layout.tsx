import { Loader2 } from 'lucide-react';
import { DateTime } from 'luxon';

import { AppShell } from 'components/AppShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
// eslint-disable-next-line import/named
import { Cashier, CashierPayment, CashierProduct } from 'types/Cashier';
import { Product } from 'types/Product';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  cashier: Cashier;
  handleBackPage: () => void;
  isLoading: boolean;
  payments: CashierPayment[];
  products: Product[];
}

interface ProductRenderProps {
  _id: string;
  name: string;
  totalAmount: number;
  commandsAppears: number;
  totalPrice: number;
}

const columns = ['Item', 'Quantidade vendido', 'Total vendido', 'Ocorrências em comandas'];

export const SoldItemsLayout = ({ cashier, handleBackPage, isLoading, products }: Props) => {
  const dt = DateTime.fromISO(cashier?.date, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');

  let totalItemsSold = 0;
  const allProducts: CashierProduct[] = [];
  const productsFilteres: ProductRenderProps[] = [];

  cashier?.payments?.forEach((payment) => {
    payment.command.products.forEach((product) => {
      totalItemsSold += product.amount;
    });
  });

  cashier?.payments?.forEach((payment) => {
    payment.command.products.forEach((product) => {
      allProducts.push({
        _id: product._id,
        name: product.name,
        amount: product.amount,
      });
    });
  });

  const verifyProductsQuantity = () => {
    allProducts.forEach((product) => {
      let productTotalAmount = 0;
      const filteredProductsById = allProducts.filter((item) => item._id === product._id);
      const commandsItemsAppears = filteredProductsById.length;
      const alreadyHasCountedProductsAmount = productsFilteres.find(
        (filteredProduct) => filteredProduct._id === product._id,
      );
      const registeredProduct = products.find((stockProduct) => stockProduct._id === product._id);

      if (!alreadyHasCountedProductsAmount && registeredProduct) {
        filteredProductsById.forEach((filteredProduct) => {
          productTotalAmount += filteredProduct.amount;
        });

        productsFilteres.push({
          _id: product._id,
          name: product.name,
          totalAmount: productTotalAmount,
          commandsAppears: commandsItemsAppears,
          totalPrice: Math.round(productTotalAmount * registeredProduct.unitPrice * 100) / 100,
        });
      }
    });

    productsFilteres?.sort((a, b) => b.totalAmount - a.totalAmount);
  };

  verifyProductsQuantity();

  return (
    <AppShell hasBackPageBtn handleBackPage={handleBackPage}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
              {cashier?.date ? (
                <>
                  Itens do dia: <span className="text-gold-strong">{dt.toLocaleString(DateTime.DATE_FULL)}</span>
                </>
              ) : (
                <>
                  Itens de:{' '}
                  <span className="text-gold-strong">
                    {cashier.month} de {cashier.year}
                  </span>
                </>
              )}
            </h1>
            <div className="rounded-card bg-primary px-4 py-1.5">
              <span className="text-lg font-bold text-primary-foreground">
                Total de itens vendidos: {Math.round(totalItemsSold * 100) / 100}
              </span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={`sold-items-detail-column-${column}`}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsFilteres.length > 0 ? (
                productsFilteres.map((product) => (
                  <TableRow key={`sold-items-oflist-${product._id}`}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{Math.round(product.totalAmount * 100) / 100}</TableCell>
                    <TableCell>{parseToBRL(product.totalPrice)}</TableCell>
                    <TableCell>{product.commandsAppears}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <span className="inline-block rounded-card bg-secondary px-4 py-2 text-lg font-bold text-navy">
                      Nenhum item encontrado
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
};
