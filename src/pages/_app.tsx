import { createContext, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from 'services/apiConfig';

interface SocketProps {
  socket: Socket;
}

export const SocketContext = createContext({} as SocketProps);

const socket = io(API_URL, { autoConnect: false });
const socketContextValue = { socket };

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChakraProvider>
      <SocketContext.Provider value={socketContextValue}>
        <Component {...pageProps} />
      </SocketContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
