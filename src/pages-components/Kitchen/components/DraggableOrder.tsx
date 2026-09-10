import React from 'react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { cn } from 'lib/utils';
import { Order as OrderProps } from 'types/Order';
import { Order } from './Order';

type Props = {
  order: OrderProps;
};

export function DraggableOrder({ order }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...attributes}
      className={cn('relative origin-center', isDragging ? 'shadow-lg' : 'shadow-sm')}
    >
      <Order order={order} listeners={listeners} isDragging={isDragging}/>
    </div>
  );
}
