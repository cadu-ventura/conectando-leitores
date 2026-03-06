'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Book } from '@/types';

type BookModalContextType = {
  book: Book | null;
  isModalOpen: boolean;
  openModal: (book: Book) => void;
  closeModal: () => void;
};

export const BookModalContext = createContext<BookModalContextType | undefined>(
  undefined,
);

export const BookModalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const isModalOpen = !!selectedBook;

  const openModal = (book: Book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const value = {
    book: selectedBook,
    isModalOpen,
    openModal,
    closeModal,
  };

  return (
    <BookModalContext.Provider value={value}>
      {children}
    </BookModalContext.Provider>
  );
};

export const useBookModal = () => {
  const context = useContext(BookModalContext);
  if (!context) {
    throw new Error(
      'useBookModal deve ser usado dentro de um BookModalProvider',
    );
  }
  return context;
};
