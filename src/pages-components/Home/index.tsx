import { Button, FormControl, Input, Text, useToast } from '@chakra-ui/react';
import { Modal } from 'components/Modal';
import { useState, useRef, FormEvent, useEffect } from 'react';
import { useRouter } from "next/router";
import { HomeLayout } from './layout';
import AuthService from './services/AuthService';

export const Home = () => {
  const [isPermittedToSeeClosedCahiers, setIsPermittedToSeeClosedCahiers] =
    useState(false);
  const [isAsksPermitionModalOpen, setIsAsksPermitionModalOpen] =
    useState(false);
  const password = useRef('');
  const [isAdmin, setIsAdmin] = useState(false)

  const toast = useToast();
  const router = useRouter();

  function handleAsksPermition() {
    password.current = '';
    setIsAsksPermitionModalOpen(true);
  }

  async function handleAccessClosedCashiers(e: FormEvent) {
    e.preventDefault();
    try {
      if (password.current === '') {
        toast({
          status: 'warning',
          title: 'Insira a senha de acesso',
        });
        return;
      }
      const { isAuthorized } = await AuthService.accessClosedCashiers(
        password.current
      );

      if (isAuthorized) {
        setIsPermittedToSeeClosedCahiers(true);
        setIsAsksPermitionModalOpen(false);
        password.current = '';
      }
    } catch (err: any) {
      toast({
        title: err?.response?.data.message,
        status: 'error',
        duration: 1000,
      });
    }
  }

  function handleCloseAsksPermitionModal() {
    setIsAsksPermitionModalOpen(false);
    setIsPermittedToSeeClosedCahiers(false);
    password.current = '';
  }

  useEffect(() => {
    const isAdminUse = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminUse)

    if (!isAdminUse) {
      router.push("/commands");
    }
  }, [router]);

  return (
    <>
      <HomeLayout
        handleAsksPermition={handleAsksPermition}
        isPermittedToSeeClosedCahiers={isPermittedToSeeClosedCahiers}
        setIsAsksPermitionModalOpen={setIsAsksPermitionModalOpen}
        isAdmin={isAdmin}
      />
      <Modal
        isOpen={isAsksPermitionModalOpen}
        onClose={handleCloseAsksPermitionModal}
        title=""
      >
        <FormControl as="form" onSubmit={handleAccessClosedCashiers}>
          <Text>Senha de acesso</Text>
          <Input
            onChange={(e) => {
              password.current = e.target.value;
            }}
            backgroundColor="transparent"
            autoFocus
            mt={1}
            type="password"
          />
          <Button type="submit" w="100%" mt={3}>
            Acessar
          </Button>
        </FormControl>
      </Modal>
    </>
  );
};
