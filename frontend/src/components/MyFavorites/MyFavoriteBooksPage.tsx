'use client';
import React from 'react';
import EmptyFavorites from '@/components/MyFavorites/EmptyFavorites';
import MyFavoriteBooks from '@/components/MyFavorites/MyFavoriteBooks';
import { useMyFavoriteBook } from '@/hooks/useMyFavoriteBook';
import Loader from '@/components/ui/Loader';
import { MyFavoriteBooksPageProps } from '@/types';

export default function MyFavoriteBooksPage({ token }: MyFavoriteBooksPageProps) {

    const { books, totalCount, empty, loading, page, limit } = useMyFavoriteBook(token);

    return (
        <section className="w-full flex flex-col items-center min-h-screen px-4 sm:px-6 md:px-10 mt-5">
            <div className="flex flex-col items-center text-center w-full max-w-3xl space-y-3">
                <h1 className="text-primary text-3xl sm:text-4xl font-bold">Meus Favoritos</h1>
                <p className="text-sm md:text-base md:w-1/2">
                    Veja aqui todos os livros que você salvou para acessar facilmente mais tarde.
                </p>
                <div className="md:w-full border-b-2 border-gray-300 mt-6 mb-8" />
            </div>

            {loading && (
                <div className="w-full flex flex-col items-center mt-10 min-h-screen px-4 sm:px-6 md:px-10">
                    <Loader />
                </div>
            )}

            {empty ? (
                <EmptyFavorites />
            ) : (
                <MyFavoriteBooks
                    books={books}
                    limit={limit}
                    totalCount={totalCount}
                    currentPage={page}
                />
            )}
        </section>
    );
}