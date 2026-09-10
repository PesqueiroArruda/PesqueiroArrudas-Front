import { useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { AppShell } from 'components/AppShell';
import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { useRouter } from 'next/router';
import AdminService from './services/index';

export const Admin = () => {
  const router = useRouter()
  const [isConfirmResetModalOpen, setIsConfirmResetModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [isReseting, setIsReseting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const accessKey = useRef('');

  const toast = useToast();

  function handleOpenConfirmationModal() {
    setIsConfirmResetModalOpen(true);
  }

  function handleOpenResetModal() {
    setIsResetModalOpen(true);
    handleCloseConfirmationModal();
  }

  function handleCloseConfirmationModal() {
    setIsConfirmResetModalOpen(false);
  }

  function handleCloseResetModal() {
    setIsResetModalOpen(false);
    setIsReseting(false);
    accessKey.current = '';
  }
  async function handleResetSystem() {
    try {
      if (isReseting) {
        return;
      }
      setIsReseting(true);

      if (accessKey.current === '') {
        toast({
          status: 'error',
          title: 'Insira a chave de acesso para resetar o sistema',
        });
        setIsReseting(false);
        return;
      }

      await AdminService.deletePayments(accessKey.current);
      await AdminService.deleteCommands(accessKey.current);

      handleCloseResetModal();
      toast({
        title: 'Sistem resetado.',
      });
    } catch (err: any) {
      toast({
        status: 'error',
        title: err?.response?.data?.message,
        duration: 1000,
        isClosable: true,
      });
      setIsReseting(false);
    }
  }

  useEffect(() => {
    const hasCleanedAuthStorage = localStorage.getItem('hasCleanedAuthStorage_v1');

    if (!hasCleanedAuthStorage) {
      localStorage.removeItem('isLogged');
      localStorage.removeItem('isUser');

      localStorage.setItem('hasCleanedAuthStorage_v1', 'true');

      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const isAdminUse = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminUse)

    if (!isAdminUse) {
      router.push("/commands");
    }
  }, [router]);

  return (
    <>
      <AppShell>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2 rounded-card border border-destructive/30 bg-destructive/10 p-4 text-center text-base font-semibold text-destructive sm:p-6 sm:text-lg">
            <TriangleAlert className="h-6 w-6" />
            <p>Todas ações executadas nesta página são de grande impacto no sistema</p>
            <p>Apenas execute estas ações quando todos os dados estiverem salvos localmente</p>
          </div>
          <Button
            onClick={handleOpenConfirmationModal}
            variant="destructive"
            disabled={!isAdmin}
            className="h-auto py-3 text-lg sm:py-4 sm:text-xl"
          >
            RESTAURAR SISTEMA
          </Button>
        </div>
      </AppShell>
      <Modal
        isOpen={isConfirmResetModalOpen}
        title="Deletar todos os dados do sistema?"
        onClose={handleCloseConfirmationModal}
      >
        <div className="flex gap-3">
          <Button className="flex-1" variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancelar
          </Button>
          <Button className="flex-1" variant="destructive" onClick={handleOpenResetModal}>
            Confirmar
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isResetModalOpen}
        onClose={handleCloseResetModal}
        title="Insira a chave de acesso para resetar o sistema"
      >
        <div className="flex flex-col gap-3">
          <Input
            onChange={(e) => {
              accessKey.current = e.target.value;
            }}
            placeholder="Chave de acesso"
            type="password"
          />
          <Button onClick={handleResetSystem} disabled={isReseting}>
            {isReseting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isReseting ? 'Restaurando' : 'Confirmar'}
          </Button>
        </div>
      </Modal>
    </>
  );
};
