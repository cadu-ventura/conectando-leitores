import type { ExternalBookResult } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type BookSearchResponse = ExternalBookResult[];

export const catalogService = {
    searchBooks: async (
        query: string,
        token: string,
    ): Promise<BookSearchResponse> => {
        const externalUrl = `${API_BASE_URL}/api/book/search?q=${encodeURIComponent(query)}`;

        const response = await fetch(externalUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error("Não autorizado pela API externa.");
            }
            if (response.status === 500) {
                throw new Error("Erro interno no servidor da API externa.");
            }
            throw new Error("Falha ao buscar os livros.");
        }

        return response.json();
    },
};
