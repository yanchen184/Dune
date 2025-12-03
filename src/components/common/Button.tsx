import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-orbitron font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-dune-spice hover:bg-opacity-90 text-white',
    secondary: 'bg-dune-sky hover:bg-dune-deep text-dune-sand border-2 border-dune-sand',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <motion.button
      className={cn(baseStyles, variantStyles[variant], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
