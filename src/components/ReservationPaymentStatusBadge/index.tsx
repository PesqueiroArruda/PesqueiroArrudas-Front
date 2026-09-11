import { BadgeCheck, Clock, X } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { ReservationPaymentStatus } from 'types/Reservation';

const CONFIG: Record<ReservationPaymentStatus, { label: string; variant: 'default' | 'success' | 'destructive'; Icon: typeof Clock }> = {
  pending: { label: 'Pendente', variant: 'default', Icon: Clock },
  paid: { label: 'Pago', variant: 'success', Icon: BadgeCheck },
  failed: { label: 'Falhou', variant: 'destructive', Icon: X },
};

interface Props {
  status: ReservationPaymentStatus;
}

export const ReservationPaymentStatusBadge = ({ status }: Props) => {
  const { label, variant, Icon } = CONFIG[status];

  return (
    <Badge variant={variant}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
};
