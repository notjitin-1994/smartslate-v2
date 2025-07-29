import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { ArrowDownward } from '@mui/icons-material';

interface ButtonProps extends MuiButtonProps {
  withArrow?: boolean;
  to?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, withArrow, to, ...props }, ref) => {
    const buttonProps = {
      ...props,
      ...(to && { component: NavLink, to }),
    };

    return (
      <MuiButton
        ref={ref}
        {...buttonProps}
        endIcon={withArrow ? <ArrowDownward /> : undefined}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
