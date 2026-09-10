/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

type Props = {
  isModalOpen: boolean;
  handleCloseAmountModal: () => void;
  amount: { current: string };
  handleAddProduct: (e: any) => void;
  isFishesCategory: boolean;
  isSelectingProduct: boolean;
};

export const SetAmountModalLayout = ({
  isModalOpen,
  handleCloseAmountModal,
  amount,
  handleAddProduct,
  isFishesCategory,
  isSelectingProduct,
}: Props) => {
  const inputRef = useRef(null);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseAmountModal}
      title="Quantidade do produto"
      initialFocusRef={inputRef}
    >
      <form onSubmit={(e) => handleAddProduct(e)} className="flex flex-col gap-4">
        {isFishesCategory ? (
          <Input ref={inputRef} type="text" onChange={(e) => (amount.current = e.target.value)} />
        ) : (
          <Input
            ref={inputRef}
            type="number"
            min={1}
            defaultValue="1"
            className="font-bold"
            onChange={(e) => (amount.current = e.target.value)}
          />
        )}
        <Button type="submit" className="w-full" disabled={isSelectingProduct}>
          {isSelectingProduct && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSelectingProduct ? 'Selecionando' : 'Selecionar Produto'}
        </Button>
      </form>
    </Modal>
  );
};
