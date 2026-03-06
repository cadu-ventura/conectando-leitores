'use client';

import { type ReactNode } from 'react';
import { useBookModal } from '@/contexts/BookModalContext';
import BookModal from '@/components/Books/ModalLivro';

interface HomepageClientProps {
  children: ReactNode;
}

export default function HomepageClient({ children }: HomepageClientProps) {
  const { book, isModalOpen, closeModal } = useBookModal();

  return (
    <>
      {children}
      <BookModal book={book} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
