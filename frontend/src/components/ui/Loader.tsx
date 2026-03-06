import clsx from 'clsx';
import { type FC } from 'react';

interface LoaderProps {
  className?: string;
}

const Loader: FC<LoaderProps> = ({ className = '' }) => {
  return (
    <div
      className={clsx(
        'h-10',
        'w-10',
        'animate-spin',
        'rounded-full',
        'border-4',
        'border-gray-300',
        'border-t-primary',
        `${className}`,
      )}
      role='status'
      aria-label='Carregando...'
    />
  );
};

export default Loader;
