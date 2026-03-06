"use client";

import {
    PendingBookContextData,
    PendingBookCardProps,
} from "@/types";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { pendingBookService } from "@/services/pendingBookService";
import { PendingBookProviderProps } from "@/types/bookRegister";

const PendingBookContext = createContext<PendingBookContextData | undefined>(undefined);

export function PendingBookProvider({ children, token }: PendingBookProviderProps) {
    const [showActions, setShowActions] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pendingBooks, setPendingBooks] = useState<PendingBookCardProps[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    const handleSetExpanded = (id: string | null) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        if (!token) return;

        (async () => {
            try {
                const data = await pendingBookService.getPendingBooks(token);
                setPendingBooks(data);
            } catch (error) {
                console.error("Erro ao buscar livros pendentes:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const approvingBook = async (id: string) => {
        try {
            await pendingBookService.updateBookStatus(
                token,
                id,
                true,
            );
            setPendingBooks((prev) => prev.filter((book) => book._id !== id));
        } catch (error) {
            console.error("Erro ao aprovar livro:", error);
            alert("Erro ao aprovar a obra.");
        }
    };

    const rejectingBook = async (justification?: string) => {
        if (!selectedBookId) return;
        try {
            await pendingBookService.updateBookStatus(
                token,
                selectedBookId,
                false,
                justification
            );
            setPendingBooks((prev) => prev.filter((book) => book._id !== selectedBookId));
        } catch (error) {
            console.error("Erro ao rejeitar livro:", error);
            alert("Erro ao rejeitar a obra.");
        }
    };

    return (
        <PendingBookContext.Provider
            value={{
                showActions,
                setShowActions,
                deleteModalOpen,
                setDeleteModalOpen,
                approvingBook,
                rejectingBook,
                pendingBooks,
                setPendingBooks,
                setSelectedBookId,
                loading,
                expanded,
                handleSetExpanded
            }}
        >
            {children}
        </PendingBookContext.Provider>
    );
}

export function usePendingBookContext() {
    const context = useContext(PendingBookContext);
    if (!context)
        throw new Error("usePendingBookContext deve ser usado dentro de PendingBookProvider");
    return context;
}