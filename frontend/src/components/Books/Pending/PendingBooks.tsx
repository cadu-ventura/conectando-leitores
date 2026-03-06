"use client";

import DeleteModal from "@/components/ui/DeleteModal";
import PendingBookCard from "./PendingBookCard";
import {
    usePendingBookContext,
    PendingBookProvider,
} from "@/contexts/PendingBookContext";
import Loader from "@/components/ui/Loader";
import { PendingBooksProps } from "@/types/bookRegister";

function PendingBooksContent() {
    const { deleteModalOpen, pendingBooks, loading } = usePendingBookContext();

    if (loading) {
        return (
            <div className="mt-10">
                <Loader />
            </div>
        );
    }

    return (
        <>
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <DeleteModal />
                </div>
            )}

            <section className="flex flex-col gap-6 w-full max-w-6xl mt-6 px-4 sm:px-8 md:px-0">
                {pendingBooks.length > 0 ? (
                    pendingBooks.map((book) => <PendingBookCard key={book._id} {...book} />)
                ) : (
                    <p className="text-gray-500 text-center">Nenhuma obra pendente.</p>
                )}
            </section>
        </>
    );
}

export default function PendingBooks({ token }: PendingBooksProps) {
    return (
        <PendingBookProvider token={token}>
            <PendingBooksContent />
        </PendingBookProvider>
    );
}
