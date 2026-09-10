import { Dispatch, SetStateAction } from 'react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
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
  isAdmin,
}: Props) => (
  <AppShell>
    <Tabs defaultValue="payed-commands">
      {isAdmin && (
        <TabsList className="mb-6">
          <TabsTrigger value="payed-commands">Comandas Pagas</TabsTrigger>
          <TabsTrigger value="closed-cashiers" onClick={handleAsksPermition}>
            Caixas Fechados
          </TabsTrigger>
          <TabsTrigger value="sold-items">Itens Vendidos</TabsTrigger>
          <TabsTrigger value="customers">Clientes Recorrentes</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="payed-commands">
        <PayedCommands isAdmin={isAdmin} />
      </TabsContent>
      <TabsContent value="closed-cashiers">
        {isPermittedToSeeClosedCahiers ? (
          <ClosedCashiers />
        ) : (
          <Button onClick={() => setIsAsksPermitionModalOpen(true)}>Acessar Caixas</Button>
        )}
      </TabsContent>
      <TabsContent value="sold-items">
        <SoldItems />
      </TabsContent>
      <TabsContent value="customers">
        <Customers />
      </TabsContent>
    </Tabs>
  </AppShell>
);
