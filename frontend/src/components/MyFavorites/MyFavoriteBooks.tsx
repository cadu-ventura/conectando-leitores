"use client";

import React, { useState } from "react";
import CardLivro from "../Books/CardLivro";
import BookModal from "../Books/ModalLivro";
import { BookModalContext } from "@/contexts/BookModalContext";
import { ApiFavoriteItem, Book } from "@/types";
import Pagination from "@/components/ui/Pagination";

interface Props {
    books: ApiFavoriteItem[];
    limit: number;
    totalCount: number;
    currentPage: number;
}

export default function MyFavoriteBooks({
    books,
    limit,
    totalCount,
    currentPage,
}: Props) {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedBook(null), 300);
    };

    const contextValue = {
        book: selectedBook,
        isModalOpen,
        openModal,
        closeModal,
    };
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <BookModalContext.Provider value={contextValue}>
            <div className="w-full max-w-6xl px-4">
                <ul
                    className="flex gap-4 overflow-x-auto pb-4
            sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
            md:grid-cols-3
            lg:grid-cols-5
          "
                >
                    {books.map((livro) => {
                        const book: Book = {
                            id: livro._id,
                            title: livro.title,
                            author: livro.author,
                            category: livro.category,
                            coverUrl: livro.coverUrl,
                            isFavorited: true,
                            language: "Português",
                            publicationYear: 0,
                            rating: 0,
                            reviewCount: 0,
                            synopsis: livro.description
                                ? livro.description
                                : "Sinopse não disponível.",
                            subtitulo: undefined,
                        };
                        return (
                            <li
                                key={livro._id}
                                className="min-w-[160px] flex-shrink-0 sm:min-w-0"
                            >
                                <CardLivro book={book} />
                            </li>
                        );
                    })}
                </ul>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    limit={limit}
                    totalCount={totalCount}
                />
            </div>
            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </BookModalContext.Provider>
    );
}
