import { Button, Flex, Text } from '@chakra-ui/react';

import { Modal } from 'components/Modal';
import { parseToBRL } from 'utils/parseToBRL';

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleCloseCashier: () => void;
  isSending: boolean;
  total: number;
}

export const CloseCashierLayout = ({
  isModalOpen,
  handleCloseModal,
  handleCloseCashier,
  isSending,
  total,
}: Props) => (
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Fechar caixa">
    <Text mb={4}>
      O caixa será fechado com o total de{' '}
      <Text as="span" fontWeight="bold">
        {parseToBRL(total)}
      </Text>
      . Essa ação não pode ser desfeita.
    </Text>
    <Flex gap={[2, 4]}>
      <Button onClick={() => handleCloseModal()} flex="1">
        Cancelar
      </Button>
      <Button
        onClick={() => handleCloseCashier()}
        flex="1"
        colorScheme="blue"
        isLoading={isSending}
        loadingText="Fechando Caixa"
      >
        Confirmar
      </Button>
    </Flex>
  </Modal>
);
