import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { IconButton, Box } from '@chakra-ui/react';
import { RxDragHandleDots2 } from 'react-icons/rx';

import { Order } from './Order';
import { Order as OrderProps } from 'types/Order';

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
      {...attributes} // atributos no container
      position="relative"
      // opcional: sombra/escala ao arrastar
      boxShadow={isDragging ? 'lg' : 'sm'}
      transformOrigin="center"
      // evita scroll estranho no mobile durante drag
      sx={{ touchAction: 'none' }}
    >
      {/* seu card de pedido */}
      <Order order={order} listeners={listeners} isDragging={isDragging}/>

      {/* HANDLE de arrastar - canto superior direito */}
      {/* <IconButton
        aria-label="Arrastar para reordenar"
        icon={<RxDragHandleDots2 />}
        size="sm"
        variant="ghost"
        position="absolute"
        top="8px"
        right="8px"
        // listeners APENAS no handle
        {...listeners}
        // UX
        cursor={isDragging ? 'grabbing' : 'grab'}
        // evita que o handle capture o foco do teclado o tempo todo
        tabIndex={0}
      /> */}
    </Box>
  );
}
