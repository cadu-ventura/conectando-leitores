'use client';

import type { Book } from '@/types';
import Image from 'next/image';
import { useBookModal } from '@/contexts/BookModalContext';
import clsx from 'clsx';

type CardLivroProps = {
  book: Book;
};

export default function CardLivro({ book }: CardLivroProps) {
  const { openModal } = useBookModal();

  return (
    <div
      onClick={() => openModal(book)}
      className={clsx(
        'group',
        'w-[192px]',
        'h-[382px]',
        'bg-white',
        'rounded-2xl',
        'p-4',
        'flex',
        'flex-col',
        'shadow-lg',
        'transition-transform',
        'duration-300',
        'hover:scale-105',
        'hover:shadow-xl',
        'hover:relative',
        'hover:z-50',
        'cursor-pointer',
      )}
    >
      {/* Imagem do Livro */}
      <div className={clsx('relative', 'mb-4')}>
        <Image
          src={book.coverUrl}
          alt={`Capa do livro ${book.title}`}
          width={153}
          height={227}
          className={clsx('w-full', 'h-[230px]', 'rounded-lg', 'object-cover')}
          unoptimized={true}
        />
      </div>

      {/* Conteúdo de Texto */}
      <div className={clsx('flex', 'flex-col', 'flex-grow')}>
        <h3
          className={clsx(
            'font-bold',
            'text-base',
            'text-gray-900',
            'leading-tight',
          )}
        >
          {book.title}
        </h3>

        <p
          className={clsx(
            'text-sm',
            'text-gray-500',
            'mt-1',
            'line-clamp-2', // corta o texto se for muito longo
            'max-w-full',
          )}
          title={book.author} // mostra o nome completo no hover
        >
          {book.author}
        </p>
        <div className={clsx('mt-auto')}>
          {' '}
          <span
            className={clsx(
              'inline-block',
              'text-xs',
              'bg-purple-100',
              'text-purple-700',
              'rounded-full',
              'px-3',
              'py-1',
              'font-semibold',
            )}
          >
            {book.category}
          </span>
        </div>
      </div>
    </div>
  );
}
