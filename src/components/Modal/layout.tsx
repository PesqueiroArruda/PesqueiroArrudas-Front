import { ReactNode, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { cn } from 'lib/utils';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: any;
  children: ReactNode;
  initialFocusRef: any;
  size?: string;
  modalBodyOverflow?: any;
}

const SIZE_CLASSNAMES: Record<string, string> = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  full: 'sm:max-w-[95vw] h-[90vh]',
};

export const ModalLayout = ({
  title,
  isOpen,
  onClose,
  size,
  initialFocusRef,
  children,
  modalBodyOverflow,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={contentRef}
        className={cn(SIZE_CLASSNAMES[size || 'lg'])}
        onOpenAutoFocus={(event) => {
          if (initialFocusRef?.current) {
            event.preventDefault();
            initialFocusRef.current.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col',
            (modalBodyOverflow || 'scroll') === 'scroll'
              ? 'max-h-[65vh] overflow-y-auto'
              : 'overflow-hidden',
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
