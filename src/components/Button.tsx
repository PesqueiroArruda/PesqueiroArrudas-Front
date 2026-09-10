import { forwardRef } from 'react';

import { Button as ShadcnButton, type ButtonProps } from 'components/ui/button';
import { cn } from 'lib/utils';

interface LegacyButtonProps extends Omit<ButtonProps, 'variant'> {
  isCallAction?: boolean;
  isDisabled?: boolean;
  // Screens not yet migrated off Chakra still pass Chakra style props
  // (w, h, isLoading, loadingText, ...) into this shared Button. Once every
  // call site is migrated to Tailwind classes, this index signature — and the
  // ChakraButton compatibility it exists for — can be removed.
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, LegacyButtonProps>(
  ({ isCallAction, isDisabled, disabled, className, ...props }, ref) => (
    <ShadcnButton
      {...props}
      ref={ref}
      disabled={disabled ?? isDisabled}
      variant={isCallAction ? 'primary' : 'secondary'}
      className={cn(className)}
    />
  ),
);

Button.displayName = 'Button';
