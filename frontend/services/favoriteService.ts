import type { ApiFavoriteItem, ApiFavoriteListResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getFavoriteList = async (token: string): Promise<string[]> => {
  const endpointUrl = `${API_URL}/book/favorite/list?page=1&limit=100`;
  const response = await fetch(endpointUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar lista de favoritos');
  }

  const data: ApiFavoriteListResponse = await response.json();
  return data.data.map((book: ApiFavoriteItem) => book._id);
};

const addFavorite = async (bookId: string, token: string): Promise<void> => {
  const endpointUrl = `${API_URL}/book/favorite/${bookId}`;

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao adicionar favorito');
  }
};

const removeFavorite = async (bookId: string, token: string): Promise<void> => {
  const endpointUrl = `${API_URL}/book/favorite/${bookId}`;

  const response = await fetch(endpointUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao remover favorito');
  }
};

export const favoriteService = {
  getFavoriteList,
  addFavorite,
  removeFavorite,
};
