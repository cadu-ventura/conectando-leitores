const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const myFavoriteBookService = {
  async getFavorites(token: string, page: number, limit: number) {
    const response = await fetch(`${API_BASE_URL}/api/book/favorite/list?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar favoritos')
    }

    return response.json()
  },
}
