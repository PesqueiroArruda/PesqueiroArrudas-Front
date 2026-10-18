import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, LogOut, WifiOff } from 'lucide-react';

import { clearSession } from 'services/session';
import Logo from '../../assets/logo.jpeg';

interface Props {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
  // Quando o servidor recusa por estar fora da rede do pesqueiro.
  isOutsideNetwork?: boolean;
}

// Casca enxuta do garçom: sem menu do balcão, só voltar e sair.
export const WaiterShell = ({ children, title, onBack, isOutsideNetwork }: Props) => {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      router.push('/login');
      return;
    }
    setName(loggedUser);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-navy px-3 text-text-on-navy">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-navy-hover"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="relative ml-1 h-8 w-8 overflow-hidden rounded-lg">
            <Image src={Logo} alt="Arruda's" fill className="object-contain" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-heading text-base font-extrabold">{title || "Arruda's"}</span>
          {name && <span className="truncate text-xs text-nav-inactive">{name}</span>}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sair"
          className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-navy-hover"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {isOutsideNetwork ? (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <WifiOff className="h-10 w-10 text-gold" />
          <h1 className="font-heading text-xl font-extrabold text-navy">Conecte no Wi-Fi do pesqueiro</h1>
          <p className="text-sm text-text-muted">
            O sistema do garçom só abre dentro do pesqueiro. Conecte na rede do local e tente de novo.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 h-12 rounded-(--radius) bg-primary px-6 text-base font-bold text-primary-foreground"
          >
            Tentar de novo
          </button>
        </main>
      ) : (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col">{children}</main>
      )}
    </div>
  );
};

// O backend responde 403 com este código quando o IP não é o do pesqueiro.
export function isOutsideNetworkError(error: any) {
  return error?.response?.status === 403 && error?.response?.data?.code === 'OUTSIDE_NETWORK';
}
