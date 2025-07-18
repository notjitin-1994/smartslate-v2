import { forwardRef, ButtonHTMLAttributes } from 'react';
import { ArrowDown } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  withArrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'primary', withArrow = true, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent shadow-lg hover:shadow-xl';
    
    const variantStyles = {
      primary: 'bg-brand-accent hover:bg-brand-accent/90 text-brand-bg',
      secondary: 'bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {withArrow && (
          <ArrowDown className="ml-2 -mr-1 w-5 h-5 transform transition-transform duration-300 group-hover:translate-y-1" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
