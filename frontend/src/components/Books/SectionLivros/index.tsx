import SectionLivrosClient from "./SectionLivros.client";
import { bookService } from "@/services/bookService";
import type { Book, ApiMostFavoritedItem } from "@/types";

type BookSectionType = "most-read" | "recommended" | "booktok";

interface SectionProps {
    title: string;
    type: BookSectionType;
}

const transformMostFavoritedToBook = (apiBook: ApiMostFavoritedItem): Book => {
    return {
        id: apiBook._id,
        title: apiBook.title,
        author: apiBook.author,
        category: apiBook.category,
        coverUrl: apiBook.coverUrl || "/placeholder-cover.png",

        isFavorited: false,
        language: "Português",
        publicationYear: 0,
        rating: 0,
        reviewCount: 0,
        synopsis: apiBook.description || "Sinopse não disponível.",
    };
};

export default async function SectionLivros({ title, type }: SectionProps) {
    let books: Book[] = [];

    try {
        if (type === "most-read") {
            books = await bookService.getMostReadBooks();
        } else if (type === "recommended") {
            const apiResponse = await bookService.getMostFavoritedBooks();
            books = apiResponse.dados.map(transformMostFavoritedToBook);
        } else if (type === "booktok") {
            books = await bookService.getBookTokBooks();
        }
    } catch (error) {
        console.error(`Erro ao buscar livros para a seção '${type}':`, error);
    }

    return <SectionLivrosClient title={title} books={books} />;
}
