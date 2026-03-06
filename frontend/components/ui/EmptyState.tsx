import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: Props) {
  return (
    <div
      className={clsx(
        'min-h-screen',
        'flex',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'rounded-2xl',
        'bg-white',
        'p-12',
        'text-center',
        'shadow-lg',
      )}
    >
      <div
        className={clsx('rounded-full', 'bg-gray-100', 'p-4', 'text-primary')}
      >
        {icon}
      </div>
      <h2 className={clsx('mt-6', 'text-xl', 'font-bold', 'text-gray-800')}>
        {title}
      </h2>
      <p className={clsx('mt-2', 'max-w-sm', 'text-gray-500')}>{message}</p>
    </div>
  );
}
