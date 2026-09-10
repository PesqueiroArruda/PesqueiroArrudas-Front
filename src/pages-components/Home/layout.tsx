import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { ClosedCashiers } from './components/ClosedCashiers';
import { PayedCommands } from './components/PayedCommands';
import { SoldItems } from './components/SoldItems';
import { Customers } from './components/Customers';
import { SalesDashboard } from './components/SalesDashboard';

interface Props {
  handleAsksPermition: (target?: 'closed-cashiers' | 'dashboard') => void;
  isPermittedToSeeClosedCahiers: boolean;
  isPermittedToSeeDashboard: boolean;
  isAdmin: boolean;
}

export const HomeLayout = ({
  handleAsksPermition,
  isPermittedToSeeClosedCahiers,
  isPermittedToSeeDashboard,
  isAdmin,
}: Props) => (
  <AppShell>
    <Tabs defaultValue="payed-commands">
      {isAdmin && (
        <TabsList className="mb-6">
          <TabsTrigger value="payed-commands">Comandas Pagas</TabsTrigger>
          <TabsTrigger value="closed-cashiers" onClick={() => handleAsksPermition('closed-cashiers')}>
            Caixas Fechados
          </TabsTrigger>
          <TabsTrigger value="sold-items">Itens Vendidos</TabsTrigger>
          <TabsTrigger value="customers">Clientes Recorrentes</TabsTrigger>
          <TabsTrigger value="sales-dashboard" onClick={() => handleAsksPermition('dashboard')}>
            Dashboard de Vendas
          </TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="payed-commands">
        <PayedCommands isAdmin={isAdmin} />
      </TabsContent>
      <TabsContent value="closed-cashiers">
        {isPermittedToSeeClosedCahiers ? (
          <ClosedCashiers />
        ) : (
          <Button onClick={() => handleAsksPermition('closed-cashiers')}>Acessar Caixas</Button>
        )}
      </TabsContent>
      <TabsContent value="sold-items">
        <SoldItems />
      </TabsContent>
      <TabsContent value="customers">
        <Customers />
      </TabsContent>
      <TabsContent value="sales-dashboard">
        {isPermittedToSeeDashboard ? (
          <SalesDashboard />
        ) : (
          <Button onClick={() => handleAsksPermition('dashboard')}>Acessar Dashboard</Button>
        )}
      </TabsContent>
    </Tabs>
  </AppShell>
);
