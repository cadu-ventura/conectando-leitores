const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const pendingBookService = {
    async getPendingBooks(token: string) {
        const res = await fetch(`${API_URL}/book/pendentes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Erro ao buscar livros pendentes");
        return res.json();
    },

    async updateBookStatus(
        token: string,
        id: string,
        status: boolean,
        justification?: string,
    ) {
        const res = await fetch(`${API_URL}/book/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status, justification }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar status do livro");
        return res.json();
    },
};
