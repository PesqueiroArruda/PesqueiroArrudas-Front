import { createContext, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Bitter, Manrope } from 'next/font/google';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';
import { API_URL } from 'services/apiConfig';
import { RouteProgressBar } from 'components/RouteProgressBar';

import 'styles/globals.css';

interface SocketProps {
  socket: Socket;
}

export const SocketContext = createContext({} as SocketProps);

const socket = io(API_URL, { autoConnect: false });
const socketContextValue = { socket };

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // O login não usa nenhum listener de socket — evita manter uma conexão
  // aberta com o backend enquanto a tela fica parada ali (ex.: um terminal
  // deslogado). Conecta normalmente assim que sai do login.
  useEffect(() => {
    if (router.pathname === '/login') {
      return undefined;
    }

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [router.pathname]);

  return (
    <div className={`${bitter.variable} ${manrope.variable}`}>
      <ChakraProvider>
        <RouteProgressBar />
        <SocketContext.Provider value={socketContextValue}>
          <Component {...pageProps} />
        </SocketContext.Provider>
      </ChakraProvider>
    </div>
  );
}

export default MyApp;
