import data from "@/data/livros.json";
import type {
    Book,
    BookListResponse,
    ApiBookListResponse,
    ApiBookListItem,
    ApiMostFavoritedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const transformApiBookToBook = (apiBook: ApiBookListItem): Book => {
    return {
        id: apiBook._id,
        title: apiBook.title,
        author: apiBook.author,
        category: apiBook.category,
        language: "Português",
        coverUrl: apiBook.coverUrl || "/placeholder-cover.png",
        publicationYear: 2024,
        rating: 0,
        reviewCount: 0,
        isFavorited: false,
        synopsis: apiBook.description || "Sinopse não disponível.",
    };
};

export const bookService = {
    getMostReadBooks: async (): Promise<Book[]> => {
        return data.livros;
    },
    getBookTokBooks: async (): Promise<Book[]> => {
        return data.livrosBooktok;
    },

    getBooks: async ({
        page,
        limit,
        token,
    }: {
        page: number;
        limit: number;
        token: string | undefined;
    }): Promise<BookListResponse> => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        const endpointUrl = `${API_URL}/api/book?${params.toString()}`;
        try {
            if (!token) {
                throw new Error(
                    "Usuário não autenticado (token não fornecido)",
                );
            }

            const response = await fetch(endpointUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            const data: ApiBookListResponse = await response.json();
            const transformedBooks = data.livros.map(transformApiBookToBook);
            return {
                books: transformedBooks,
                totalCount: data.total,
            };
        } catch (error) {
            console.error("Erro ao buscar livros:", error);
            return { books: [], totalCount: 0 };
        }
    },

    getMostFavoritedBooks: async (
        limit: number = 20,
    ): Promise<ApiMostFavoritedResponse> => {
        const endpointUrl = `${API_URL}/api/book/favorite/mostFavorite?limit=${limit}`;

        const MAX_RETRIES = 5; // Tentar 5 vezes
        const RETRY_DELAY = 2000; // Esperar 2 segundos (2000ms) entre as tentativas

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await fetch(endpointUrl, {
                    method: "GET",
                    next: { revalidate: 1800 },
                });

                if (response.ok) {
                    // Sucesso! Retorna os dados.
                    return response.json();
                }

                // Se a API respondeu com um erro (ex: 404, 500)
                console.warn(
                    `[Tentativa ${attempt}/${MAX_RETRIES}] Erro na API (mostFavorite): ${response.statusText}`,
                );
            } catch (error) {
                let errorMessage = "Erro desconhecido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                console.warn(
                    `[Tentativa ${attempt}/${MAX_RETRIES}] Erro de conexão (mostFavorite):`,
                    errorMessage,
                );
            }

            // Espera antes de tentar de novo (exceto na última tentativa)
            if (attempt < MAX_RETRIES) {
                await new Promise((res) => setTimeout(res, RETRY_DELAY));
            }
        }

        // Se o loop terminar sem sucesso
        console.error(
            "Erro ao buscar livros mais favoritados: Limite de tentativas excedido.",
        );
        return {
            mensagem: "Erro: A API de livros está indisponível.",
            total: 0,
            dados: [],
        };
    },
    deleteBook: async (id: string, token: string | null) => {
        const endpointUrl = `${API_URL}/api/book/delete/${id}`;
        try {
            if (!token) throw new Error("Usuário não autenticado");

            const response = await fetch(endpointUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Erro ao deletar livro: ${errText}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Erro ao deletar livro:", error);
            return { success: false };
        }
    },
};
