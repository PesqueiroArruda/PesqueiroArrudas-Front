import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { ClosedCashiers } from './components/ClosedCashiers';
import { PayedCommands } from './components/PayedCommands';

interface Props {
  handleAsksPermition: () => void;
  isPermittedToSeeClosedCahiers: boolean;
  isAdmin: boolean;
}

export const HomeLayout = ({
  handleAsksPermition,
  isPermittedToSeeClosedCahiers,
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
        </TabsList>
      )}

      <TabsContent value="payed-commands">
        <PayedCommands isAdmin={isAdmin} />
      </TabsContent>
      <TabsContent value="closed-cashiers">
        {isPermittedToSeeClosedCahiers ? (
          <ClosedCashiers />
        ) : (
          <Button onClick={handleAsksPermition}>Acessar Caixas</Button>
        )}
      </TabsContent>
    </Tabs>
  </AppShell>
);
