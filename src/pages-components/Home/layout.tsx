import {
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import { Header } from 'components/Header';
import { Layout } from 'components/Layout';
import { Dispatch, SetStateAction } from 'react';
import { ClosedCashiers } from './components/ClosedCashiers';
import { PayedCommands } from './components/PayedCommands';
import { SoldItems } from './components/SoldItems';
import { Customers } from './components/Customers';

interface Props {
  handleAsksPermition: () => void;
  isPermittedToSeeClosedCahiers: boolean;
  setIsAsksPermitionModalOpen: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
}

export const HomeLayout = ({
  handleAsksPermition,
  isPermittedToSeeClosedCahiers,
  setIsAsksPermitionModalOpen,
  isAdmin
}: Props) => (
  <Layout>
    <Header />
    <Tabs>
      {console.log(isAdmin)}
      {isAdmin && (
        <TabList mb={[2, 4]}>
          <Tab>Comandas Pagas</Tab>
          <Tab onClick={handleAsksPermition}>Caixas Fechados</Tab>
          <Tab>Itens vendidos</Tab>
          <Tab>Clientes recorrentes</Tab>
        </TabList>
      )}

      <TabPanels>
        <TabPanel>
          <PayedCommands isAdmin={isAdmin} />
        </TabPanel>
        <TabPanel>
          {isPermittedToSeeClosedCahiers ? (
            <ClosedCashiers />
          ) : (
            <Button onClick={() => setIsAsksPermitionModalOpen(true)}>
              Acessar Caixas
            </Button>
          )}
        </TabPanel>
        <TabPanel>
          <SoldItems />
        </TabPanel>
        <TabPanel>
          <Customers />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Layout>
);
