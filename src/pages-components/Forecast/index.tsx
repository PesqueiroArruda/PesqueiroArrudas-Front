import { FormEvent, useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { AppShell } from 'components/AppShell';
import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import AuthService from 'pages-components/Home/services/AuthService';
import { ForecastAccuracy, ForecastResponse } from 'types/Forecast';
import ForecastService from './services/ForecastService';
import { ForecastLayout } from './layout';

export const Forecast = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isAsksPermitionModalOpen, setIsAsksPermitionModalOpen] =
    useState(false);
  const password = useRef('');

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [accuracy, setAccuracy] = useState<ForecastAccuracy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);
    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      setIsAsksPermitionModalOpen(true);
    }
  }, [isAdmin]);

  async function handleAccess(e: FormEvent) {
    e.preventDefault();
    try {
      if (password.current === '') {
        toast({ status: 'warning', title: 'Insira a senha de acesso' });
        return;
      }
      const { isAuthorized } = await AuthService.accessClosedCashiers(
        password.current
      );
      if (isAuthorized) {
        setIsPermitted(true);
        setIsAsksPermitionModalOpen(false);
        password.current = '';
      }
    } catch (err: any) {
      toast({
        title:
          err?.response?.data?.message || 'Request failed. Please try again.',
        status: 'error',
        duration: 1000,
      });
    }
  }

  function handleCloseAsksPermitionModal() {
    setIsAsksPermitionModalOpen(false);
    password.current = '';
  }

  useEffect(() => {
    if (!isPermitted) return;
    (async () => {
      try {
        const [detail, accuracyData] = await Promise.all([
          ForecastService.getDetail(14),
          ForecastService.getAccuracy(28),
        ]);
        setForecast(detail);
        setAccuracy(accuracyData);
      } catch {
        setHasFailed(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isPermitted]);

  return (
    <>
      <AppShell>
        {isPermitted ? (
          <ForecastLayout
            forecast={forecast}
            accuracy={accuracy}
            isLoading={isLoading}
            hasFailed={hasFailed}
          />
        ) : (
          <Button onClick={() => setIsAsksPermitionModalOpen(true)}>
            Acessar previsão
          </Button>
        )}
      </AppShell>
      <Modal
        isOpen={isAsksPermitionModalOpen}
        onClose={handleCloseAsksPermitionModal}
        title="Senha de acesso"
      >
        <form onSubmit={handleAccess} className="flex flex-col gap-3">
          <Input
            onChange={(e) => {
              password.current = e.target.value;
            }}
            autoFocus
            type="password"
          />
          <Button type="submit" className="w-full">
            Acessar
          </Button>
        </form>
      </Modal>
    </>
  );
};
