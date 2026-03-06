import Link from 'next/link';
import clsx from 'clsx';
import type { LucideProps } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

type BaseProps = {
  id: string;
  icon: ComponentType<LucideProps>;
  children: ReactNode;
  variant?: 'default' | 'danger';
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: () => void;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick: () => void;
};

type MenuItemProps = LinkProps | ButtonProps;

export function MenuItem({
  id,
  icon: Icon,
  children,
  href,
  onClick,
  variant = 'default',
}: MenuItemProps) {
  const isDanger = variant === 'danger';

  const className = clsx(
    'flex',
    'items-center',
    'gap-3',
    'w-full',
    'p-3',
    'mb-2',
    'rounded-lg',
    'font-sans',
    'text-lg',
    'font-medium',
    'transition-colors',
    'duration-150',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-primary',
    'hover:cursor-pointer',
    {
      'text-error hover:bg-error/10': isDanger,
      'text-gray-700 hover:bg-primary/10 hover:text-primary': !isDanger,
    },
  );

  if (href) {
    return (
      <Link id={id} href={href} onClick={onClick} className={className}>
        <Icon size={24} aria-hidden='true' />
        <div>{children}</div>
      </Link>
    );
  }

  return (
    <button id={id} type='button' onClick={onClick} className={className}>
      <Icon size={24} aria-hidden='true' />
      <div>{children}</div>
    </button>
  );
}
