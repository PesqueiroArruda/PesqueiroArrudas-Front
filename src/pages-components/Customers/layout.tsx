import { Loader2 } from 'lucide-react';
import { DateTime } from 'luxon';

import { AppShell } from 'components/AppShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
// eslint-disable-next-line import/named
import { Cashier, CashierPayment } from 'types/Cashier';

interface Props {
  cashier: Cashier;
  handleBackPage: () => void;
  isLoading: boolean;
  payments: CashierPayment[];
}

const columns = ['Cliente', 'Quantidade de visitas', 'Valor total gasto'];

function contarNomesRepetidos(nomes: any) {
  const contagem: any = {};

  nomes.forEach((item: any) => {
    const nome = item.name;
    const { total } = item;

    if (contagem[nome]) {
      contagem[nome].total += total;
      contagem[nome].ocorrencias += 1;
    } else {
      contagem[nome] = { total, ocorrencias: 1 };
    }
  });

  const contagemArray = Object.entries(contagem);

  contagemArray.sort((a: any, b: any) => {
    if (b[1].ocorrencias !== a[1].ocorrencias) {
      return b[1].ocorrencias - a[1].ocorrencias;
    }
    return b[1].total - a[1].total;
  });

  return contagemArray.map(([nome, info]: [nome: any, info: any]) => ({
    name: nome,
    total: info.total,
    ocorrencias: info.ocorrencias,
  }));
}

export const CustomersLayout = ({ cashier, handleBackPage, isLoading }: Props) => {
  const dt = DateTime.fromISO(cashier?.date, {
    zone: 'pt-BR',
    setZone: true,
  }).setLocale('pt-BR');

  const totalItemsSold = cashier?.payments?.length;

  const allCommands: any = [];
  cashier?.payments?.forEach((payment) => {
    allCommands.push({ name: payment?.command?.table?.trim().toLowerCase(), total: payment?.totalPayed });
  });

  const result = contarNomesRepetidos(allCommands);

  return (
    <AppShell hasBackPageBtn handleBackPage={handleBackPage}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
              {cashier?.date ? (
                <>
                  Clientes do dia: <span className="text-gold-strong">{dt.toLocaleString(DateTime.DATE_FULL)}</span>
                </>
              ) : (
                <>
                  Clientes de:{' '}
                  <span className="text-gold-strong">
                    {cashier.month} de {cashier.year}
                  </span>
                </>
              )}
            </h1>
            <div className="rounded-card bg-primary px-4 py-1.5">
              <span className="text-lg font-bold text-primary-foreground">
                Total de comandas: {Math.round((totalItemsSold || 0) * 100) / 100}
              </span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={`customers-detail-column-${column}`}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.length > 0 ? (
                result.map((command: any) => (
                  <TableRow key={`sold-items-oflist-${command.name}`}>
                    <TableCell>{command.name.charAt(0).toUpperCase() + command.name.slice(1)}</TableCell>
                    <TableCell>{command.ocorrencias}</TableCell>
                    <TableCell>R$ {command.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <span className="inline-block rounded-card bg-secondary px-4 py-2 text-lg font-bold text-navy">
                      Nenhum cliente encontrado
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
};
