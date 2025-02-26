/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import io from 'socket.io-client';

interface SocketProps {
  socket: any;
}

export const SocketContext = createContext({} as SocketProps);

const prodUrl = 'https://pesqueiroarruda-back.herokuapp.com';

const socket = io(prodUrl);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SocketContext.Provider value={{ socket }}>
        <Component {...pageProps} />
      </SocketContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
