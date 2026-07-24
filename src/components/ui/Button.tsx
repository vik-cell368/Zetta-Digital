import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, onMouseEnter, onClick, ...props }, ref) => {
    const variants = {
      primary: 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-sm border border-transparent',
      secondary: 'bg-dark-900 text-white hover:bg-dark-800 border border-transparent',
      outline: 'bg-transparent text-white hover:bg-dark-950 border border-white/10',
      ghost: 'bg-transparent text-gray-300 hover:bg-dark-900 hover:text-white border border-transparent',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-transparent',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
