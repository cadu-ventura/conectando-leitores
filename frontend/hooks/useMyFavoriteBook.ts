'use client';
import { useState, useEffect } from 'react';
import { ApiFavoriteItem, ApiFavoriteListResponse } from '@/types';
import { myFavoriteBookService } from '@/services/myFavoriteBookService';
import { useSearchParams } from 'next/navigation';

export const useMyFavoriteBook = (token: string) => {
  const [books, setBooks] = useState<ApiFavoriteItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setEmpty(true);
      setBooks([]);
      setTotalCount(0);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data: ApiFavoriteListResponse =
          await myFavoriteBookService.getFavorites(token, page, limit);

        const favorites = data?.data || [];
        setBooks(favorites);

        setTotalCount(data?.meta?.total || 0);
        setEmpty(favorites.length === 0);
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        setBooks([]);
        setTotalCount(0);
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, page, limit]);

  return { books, totalCount, empty, loading, page, limit };
};