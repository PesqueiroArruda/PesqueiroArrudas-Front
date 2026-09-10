import { Dispatch, ReactNode, SetStateAction } from 'react';
import { LayoutDashboard, Loader2 } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { parseToBRL } from 'utils/parseToBRL';
import { SalesDashboardStats, ShareStat } from 'utils/buildSalesDashboardStats';
import { NavHeader } from './NavHeader';

interface Props {
  stats: SalesDashboardStats;
  isLoading: boolean;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
}

const PIE_PALETTE = ['#c8a24d', '#1c2b4a', '#2f855a', '#3182ce', '#c53030', '#805ad5', '#dd6b20'];

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-card border border-border bg-secondary p-4">
    <h2 className="font-heading text-lg font-extrabold text-navy">{title}</h2>
    {children}
  </div>
);

const EmptyHint = ({ text }: { text: string }) => (
  <span className="text-sm text-text-muted">{text}</span>
);

const PieChart = ({ data }: { data: ShareStat[] }) => {
  let cumulative = 0;
  const stops = data.map((entry, index) => {
    const start = cumulative;
    cumulative += entry.percentage;
    return `${PIE_PALETTE[index % PIE_PALETTE.length]} ${start}% ${cumulative}%`;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div
        className="h-32 w-32 shrink-0 rounded-full shadow-sm"
        style={{ background: data.length ? `conic-gradient(${stops.join(', ')})` : '#e2e8f0' }}
      />
      <ul className="flex flex-col gap-1.5">
        {data.map((entry, index) => (
          <li key={entry.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: PIE_PALETTE[index % PIE_PALETTE.length] }}
            />
            <span className="font-semibold text-navy">{entry.label}</span>
            <span className="text-text-muted">
              {entry.percentage}% · {parseToBRL(entry.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SalesDashboardLayout = ({ stats, isLoading, month, setMonth, year, setYear }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-navy" />
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">Dashboard de Vendas</h1>
      </div>

      <NavHeader month={month} setMonth={setMonth} year={year} setYear={setYear} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-card bg-secondary px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-text-muted">Faturamento</p>
          <p className="font-heading text-lg font-extrabold text-navy">{parseToBRL(stats.totalRevenue)}</p>
        </div>
        <div className="rounded-card bg-secondary px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-text-muted">Comandas pagas</p>
          <p className="font-heading text-lg font-extrabold text-navy">{stats.paidCommandsCount}</p>
        </div>
        <div className="rounded-card bg-secondary px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-text-muted">Ticket médio</p>
          <p className="font-heading text-lg font-extrabold text-navy">{parseToBRL(stats.averageTicket)}</p>
        </div>
        <div className="rounded-card bg-secondary px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-text-muted">Ticket médio por pessoa</p>
          <p className="font-heading text-lg font-extrabold text-navy">{parseToBRL(stats.averageTicketPerPerson)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Itens mais vendidos">
          {stats.bestSellingItems.length === 0 ? (
            <EmptyHint text="Nenhuma venda no período." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Receita estimada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.bestSellingItems.map((item) => (
                  <TableRow key={`best-${item.name}`}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{parseToBRL(item.estimatedRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Itens menos vendidos">
          {stats.worstSellingItems.length === 0 ? (
            <EmptyHint text="Nenhuma venda no período." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Receita estimada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.worstSellingItems.map((item) => (
                  <TableRow key={`worst-${item.name}`}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{parseToBRL(item.estimatedRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Produtos que não venderam no período">
        {stats.neverSoldProducts.length === 0 ? (
          <EmptyHint text="Todos os produtos do catálogo venderam ao menos uma vez." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {stats.neverSoldProducts.map((product) => (
              <span
                key={product.name}
                className="rounded-(--radius) bg-card px-3 py-1 text-sm font-semibold text-navy shadow-sm"
              >
                {product.name}
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Melhores meses">
          {stats.monthsRanked.length === 0 ? (
            <EmptyHint text="Sem dados suficientes — selecione 'Todos' em mês/ano pra comparar meses." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Faturamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.monthsRanked.map((entry) => (
                  <TableRow key={`month-${entry.label}`}>
                    <TableCell className="capitalize">{entry.label}</TableCell>
                    <TableCell>{parseToBRL(entry.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Melhor dia da semana">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Faturamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.weekdaysRanked.map((entry) => (
                <TableRow key={`weekday-${entry.weekday}`}>
                  <TableCell className="capitalize">{entry.weekday}</TableCell>
                  <TableCell>{parseToBRL(entry.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Clientes recorrentes">
        {stats.repeatCustomers.length === 0 ? (
          <EmptyHint text="Nenhum cliente com mais de uma visita no período." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Quantidade de visitas</TableHead>
                <TableHead>Valor total gasto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.repeatCustomers.map((entry) => (
                <TableRow key={`repeat-customer-${entry.name}`}>
                  <TableCell className="capitalize">{entry.name}</TableCell>
                  <TableCell>{entry.visits}</TableCell>
                  <TableCell>{parseToBRL(entry.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Horário de pico (comandas simultaneamente abertas)">
        {stats.peakHours.length === 0 ? (
          <EmptyHint text="Ainda sem dados suficientes — essa métrica só existe pra caixas fechados a partir de agora." />
        ) : (
          <div className="flex flex-wrap gap-3">
            {stats.peakHours.map((entry) => (
              <div key={`hour-${entry.hour}`} className="rounded-card bg-card px-4 py-2 text-center shadow-sm">
                <p className="font-heading text-base font-extrabold text-navy">
                  {String(entry.hour).padStart(2, '0')}h
                </p>
                <p className="text-xs text-text-muted">{entry.concurrentCount} comandas</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Formas de pagamento">
          {stats.paymentTypeBreakdown.length === 0 ? (
            <EmptyHint text="Nenhum pagamento no período." />
          ) : (
            <PieChart data={stats.paymentTypeBreakdown} />
          )}
        </SectionCard>

        <SectionCard title="Restaurante × Pesqueiro">
          {stats.restaurantVsFishing.every((entry) => entry.total === 0) ? (
            <EmptyHint text="Nenhum pagamento no período." />
          ) : (
            <PieChart data={stats.restaurantVsFishing} />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Vendas por categoria">
          {stats.categoryBreakdown.length === 0 ? (
            <EmptyHint text="Nenhuma venda no período." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Qtd. vendida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.categoryBreakdown.map((entry) => (
                  <TableRow key={`category-${entry.category}`}>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Desempenho por garçom">
          {stats.waiterRanking.length === 0 ? (
            <EmptyHint text="Nenhuma venda no período." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garçom</TableHead>
                  <TableHead>Total vendido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.waiterRanking.map((entry) => (
                  <TableRow key={`waiter-${entry.label}`}>
                    <TableCell>{entry.label}</TableCell>
                    <TableCell>{parseToBRL(entry.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>
    </div>
  );
};
