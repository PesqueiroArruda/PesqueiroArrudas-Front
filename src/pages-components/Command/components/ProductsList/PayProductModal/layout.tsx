/* eslint-disable no-unsafe-optional-chaining */
import { Dispatch, SetStateAction, useContext } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { CommandContext } from 'pages-components/Command';
import { Product } from 'types/Product';
import { formatDecimalNum } from 'utils/formatDecimalNum';
import { parseToBRL } from 'utils/parseToBRL';

const paymentOptions = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Ifood'];

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handlePayProduct: (e: any) => void;
  productInfos: Product;
  paymentValue: string;
  setPaymentValue: Dispatch<SetStateAction<string>>;
  amountToPay: number;
  setAmountToPay: Dispatch<SetStateAction<number>>;
  typeOfPayment: 'unit' | 'free';
  setTypeOfPayment: Dispatch<SetStateAction<'unit' | 'free'>>;
  isPaying: boolean;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
}

const selectClassName =
  'h-10 cursor-pointer rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const PayProductModalLayout = ({
  isModalOpen,
  handleCloseModal,
  handlePayProduct,
  productInfos,
  paymentValue,
  setPaymentValue,
  amountToPay,
  setAmountToPay,
  typeOfPayment,
  setTypeOfPayment,
  isPaying,
  paymentType,
  setPaymentType,
}: Props) => {
  const { command } = useContext(CommandContext);
  const totalOfProduct = productInfos.amount * productInfos.unitPrice;

  const tempRestValueToBePayedNum =
    Math.round((totalOfProduct - (productInfos.totalPayed as number) + Number.EPSILON) * 100) / 100;

  const tempTotalToBePayed =
    Math.round(((command?.total || 0) - (command?.totalPayed || 0) + Number.EPSILON) * 100) / 100;
  const commandValueToBePayed = tempTotalToBePayed > 0 ? tempTotalToBePayed : 0;

  // If the value to be payed of some product is greater thant the necesary to be payed of command
  // it means the user made a payment of part of command.
  const restValueToBePayedNum =
    tempRestValueToBePayedNum > commandValueToBePayed ? commandValueToBePayed : tempRestValueToBePayedNum;

  const totalToBePayed = formatDecimalNum({
    num: restValueToBePayedNum.toString(),
    to: 'comma',
  });

  return (
    <Modal isOpen={isModalOpen} onClose={() => handleCloseModal()} title="Pagar produto" size="2xl">
      <form onSubmit={(e) => handlePayProduct(e)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="flex-1 text-lg font-bold text-navy">{productInfos?.name}</span>
            <select
              value={typeOfPayment}
              onChange={(e) => setTypeOfPayment(e.target.value as 'unit' | 'free')}
              className={selectClassName}
            >
              <option value="free">Pagar por valor livre</option>
              <option value="unit">Pagar por unidade</option>
            </select>
          </div>

          {typeOfPayment === 'unit' ? (
            <>
              <span className="text-sm font-semibold text-navy">Quantidade a Pagar</span>
              <Input
                type="number"
                min={0}
                max={productInfos?.amount}
                value={amountToPay}
                onChange={(e) => setAmountToPay(Number(e.target.value))}
              />
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-navy">Valor a pagar</span>
              <Input
                placeholder="Valor a pagar"
                type="text"
                max={productInfos?.unitPrice * productInfos?.amount || 0}
                onChange={(e) => setPaymentValue(e.target.value)}
              />
            </>
          )}
        </div>

        {typeOfPayment === 'unit' && (
          <span className="text-sm font-semibold text-navy">
            Pagar: {parseToBRL(Number(paymentValue) || 0)}
          </span>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy">Meio de Pagamento</span>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className={`${selectClassName} w-full`}
          >
            {paymentOptions.map((payment) => (
              <option key={`payment-option-${payment}`}>{payment}</option>
            ))}
          </select>
        </div>

        <span className="text-sm font-semibold text-navy">Total a ser pago: {totalToBePayed}</span>

        <Button type="submit" disabled={isPaying}>
          {isPaying && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPaying ? 'Pagando Produto' : 'Pagar Produto'}
        </Button>
      </form>
    </Modal>
  );
};
