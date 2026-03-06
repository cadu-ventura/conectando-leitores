'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { favoriteService } from '@/services/favoriteService';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  toggleFavorite: (bookId: string) => Promise<void>;
  isFavorite: (bookId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      setIsLoading(true);
      favoriteService
        .getFavoriteList(token)
        .then(ids => {
          setFavoriteIds(new Set(ids));
        })
        .catch(error => {
          console.error('Falha ao carregar favoritos:', error);
          setFavoriteIds(new Set());
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFavoriteIds(new Set());
      setIsLoading(false);
    }
  }, [token, user]);

  const isFavorite = useCallback(
    (bookId: string) => favoriteIds.has(bookId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (bookId: string) => {
      if (!token) {
        return;
      }

      const isCurrentlyFavorited = favoriteIds.has(bookId);

      setFavoriteIds(prevIds => {
        const newIds = new Set(prevIds);
        if (isCurrentlyFavorited) {
          newIds.delete(bookId);
        } else {
          newIds.add(bookId);
        }
        return newIds;
      });

      try {
        if (isCurrentlyFavorited) {
          await favoriteService.removeFavorite(bookId, token);
        } else {
          await favoriteService.addFavorite(bookId, token);
        }
      } catch (error) {
        console.error('Falha ao sincronizar favorito:', error);
        setFavoriteIds(prevIds => {
          const newIds = new Set(prevIds);
          if (isCurrentlyFavorited) {
            newIds.add(bookId);
          } else {
            newIds.delete(bookId);
          }
          return newIds;
        });
      }
    },
    [token, favoriteIds],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite,
      isFavorite,
      isLoading,
    }),
    [favoriteIds, toggleFavorite, isFavorite, isLoading],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      'useFavorites deve ser usado dentro de um FavoritesProvider',
    );
  }
  return context;
};
