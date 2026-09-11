import { BadgeCheck, PackageCheck, Truck } from 'lucide-react';

import { Badge } from 'components/ui/badge';
import { IfoodDeliveryStatus } from 'types/IfoodOrder';

const CONFIG: Record<Exclude<IfoodDeliveryStatus, null | undefined>, { label: string; variant: 'default' | 'cyan' | 'success'; Icon: typeof Truck }> = {
  confirmed: { label: 'Confirmado', variant: 'default', Icon: PackageCheck },
  dispatched: { label: 'Despachado', variant: 'cyan', Icon: Truck },
  concluded: { label: 'Concluído', variant: 'success', Icon: BadgeCheck },
};

interface Props {
  status: IfoodDeliveryStatus | undefined;
}

export const DeliveryStatusBadge = ({ status }: Props) => {
  if (!status) return null;

  const { label, variant, Icon } = CONFIG[status];

  return (
    <Badge variant={variant}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
};
