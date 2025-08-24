import React from 'react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Box } from '@chakra-ui/react';

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
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      position="relative"
      boxShadow={isDragging ? 'lg' : 'sm'}
      transformOrigin="center"
      sx={{ touchAction: 'none' }}
    >
      <Order order={order} listeners={listeners} isDragging={isDragging}/>
    </Box>
  );
}
