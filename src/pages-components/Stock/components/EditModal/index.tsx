import { SetStateAction, Dispatch, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';

// import { formatPrice } from 'utils/formatPrice';
import { formatDecimalNum } from 'utils/formatDecimalNum';
import { StockContext } from 'pages-components/Stock';
import { uploadFileToPresignedUrl } from 'utils/uploadFileToPresignedUrl';
import StockService from '../../services/index';
import { EditModalLayout } from './layout';
import type { Item } from '../../types/Item';

interface Props {
  itemInfos: Item;
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  itemInfos,
}: Props) => {
  const { productsDispatch } = useContext(StockContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const toast = useToast();

  async function handleMenuImageChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const { uploadUrl, imageKey } = await StockService.getPresignedUploadUrl({
        productId: String(itemInfos.id),
        contentType: file.type,
      });

      await uploadFileToPresignedUrl({ uploadUrl, file, contentType: file.type });

      itemInfos.setMenu((prev) => ({ ...prev, imageKey }));
      toast({ status: 'success', title: 'Imagem enviada!' });
    } catch (err: any) {
      toast({
        status: 'error',
        title: err?.response?.data?.message || 'Falha ao enviar a imagem.',
      });
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSubmit(e: any) {
    try {
      e.preventDefault();

      setIsSubmitting(true);
      if (isSubmitting) {
        return;
      }

      const {
        name,
        amount,
        unitPrice: updatedUnitPrice,
        category,
        image,
        id,
        menu,
      }: any = itemInfos;

      const unitPrice = updatedUnitPrice;
      const formattedUnitPrice = Number(
        formatDecimalNum({
          num: unitPrice,
          to: 'point',
        })
      ); // 33,90 -> 33.90
      const isUnitPriceValid = !!formattedUnitPrice || formattedUnitPrice === 0; // 44.9 = true | 44,9 = false | 33,fd = false

      if (!isUnitPriceValid) {
        toast({
          status: 'error',
          title: 'Preço inválido :(',
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      if (!name || (!amount && amount !== 0) || !category) {
        toast({
          status: 'error',
          title: 'Preencha os campos obrigatórios',
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      const { product: newProduct, message } = await StockService.updateProduct(
        {
          _id: id,
          name,
          amount,
          category,
          imageURL: image,
          unitPrice: formattedUnitPrice,
          menu: {
            ...menu,
            order: Number(menu?.order) || 0,
          },
        }
      );

      productsDispatch({
        type: 'UPDATE-ONE-PRODUCT',
        payload: { product: newProduct },
      });

      toast({
        status: 'success',
        title: message,
      });

      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: err?.response?.data?.message,
        duration: 2000,
      });
    }
  }

  function onClose() {
    setIsEditModalOpen(false);
    setIsSubmitting(false);
  }

  function handleChangeUnitPrice(e: any) {
    itemInfos.setUnitPrice(e.target.value);
  }

  return (
    <EditModalLayout
      title="Editar Item"
      isEditModalOpen={isEditModalOpen}
      onClose={onClose}
      itemInfos={itemInfos}
      handleSubmit={handleSubmit}
      handleChangeUnitPrice={handleChangeUnitPrice}
      isSubmitting={isSubmitting}
      handleMenuImageChange={handleMenuImageChange}
      isUploadingImage={isUploadingImage}
    />
  );
};
