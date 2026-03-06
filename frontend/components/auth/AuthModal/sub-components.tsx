'use client';

import clsx from 'clsx';
import type { FC } from 'react';

// --- Componente Loader ---
// Não precisa de interatividade, mas pode ficar aqui por organização.
interface LoaderProps {
  className?: string;
}
export const Loader: FC<LoaderProps> = ({ className = '' }) => (
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

// --- Botão de Aba ---
// Precisa ser um client component por causa do `onClick`.
export const TabButton = ({
  active,
  onClick,
  children,
  id,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  id: string;
}) => (
  <button
    id={id}
    onClick={onClick}
    className={clsx(
      'relative',
      'flex-1',
      'py-2',
      'text-sm',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'z-10',
      'hover:cursor-pointer'
    )}
  >
    <span
      className={clsx(
        'relative',
        'z-10',
        `${active ? 'text-white' : 'text-tertiary'}`,
      )}
    >
      {children}
    </span>
  </button>
);
