import { Ban, Check, Clock, X } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { ReservationOperationalStatus } from 'types/Reservation';

const CONFIG: Record<ReservationOperationalStatus, { label: string; variant: 'outline' | 'success' | 'destructive'; Icon: typeof Clock }> = {
  pendente: { label: 'Pendente', variant: 'outline', Icon: Clock },
  compareceu: { label: 'Compareceu', variant: 'success', Icon: Check },
  nao_compareceu: { label: 'Não compareceu', variant: 'destructive', Icon: X },
  cancelada_cliente: { label: 'Cancelado pelo cliente', variant: 'outline', Icon: Ban },
};

interface Props {
  status: ReservationOperationalStatus;
}

export const ReservationOperationalStatusBadge = ({ status }: Props) => {
  const { label, variant, Icon } = CONFIG[status];

  return (
    <Badge variant={variant}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
};
