"use client";
import { useEffect, useState } from "react";
import { bookService } from "@/services/bookService";
import { Book, DeletingBookResponse } from "@/types";
import { useSearchParams } from "next/navigation";

export function useDeletingBook(token: string | null): DeletingBookResponse {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [openBookId, setOpenBookId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const totalPages = Math.ceil(totalCount / limit);
    const [submissionStatus, setSubmissionStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchBooks = async () => {
            setLoading(true);
            try {
                const data = await bookService.getBooks({
                    page,
                    limit,
                    token: token ?? undefined,
                });
                setBooks(data.books);
                setTotalCount(data.totalCount);
            } catch (err) {
                console.error("Erro ao buscar livros:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [token, page]);

    const handlePopupClose = () => {
        setSubmissionStatus("idle");
        setSubmitError(null);
    };

    const handleDeleteBook = async () => {
        if (!token || !selectedBookId) return;

        try {
            const result = await bookService.deleteBook(selectedBookId, token);

            if (result.success) {
                setBooks((prev) =>
                    prev.filter((book) => book.id !== selectedBookId),
                );
                setSubmissionStatus("success");
            } else {
                setSubmitError(result.success || "Erro desconhecido.");
                setSubmissionStatus("error");
            }
        } catch (err) {
            console.error(err);
            setSubmitError("Erro ao excluir a obra.");
            setSubmissionStatus("error");
        } finally {
            setConfirmationModal(false);
            setSelectedBookId(null);
        }
    };

    return {
        books,
        totalCount,
        totalPages,
        page,
        limit,
        confirmationModal,
        setConfirmationModal,
        openBookId,
        setOpenBookId,
        selectedBookId,
        setSelectedBookId,
        handleDeleteBook,
        loading,
        handlePopupClose,
        submitError,
        setSubmitError,
        submissionStatus,
        setSubmissionStatus,
    };
}
