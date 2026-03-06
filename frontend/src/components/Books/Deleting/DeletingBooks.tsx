'use client';
import Pagination from "@/components/ui/Pagination";
import Loader from "@/components/ui/Loader";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import clsx from "clsx";
import { useDeletingBook } from "@/hooks/useDeletingBook";
import BookListMobile from "./BookListMobile";
import BookTable from "./DeleteBookTable";
import FeedbackPopup from "@/components/ui/FeedbackPopup";
interface DeletingBooksProps {
    token: string | null;
}

export default function DeletingBooks({ token }: DeletingBooksProps) {
    const {
        books,
        totalCount,
        totalPages,
        page,
        limit,
        confirmationModal,
        setConfirmationModal,
        openBookId,
        setOpenBookId,
        handleDeleteBook,
        loading,
        setSelectedBookId,
        submissionStatus,
        submitError,
        handlePopupClose
    } = useDeletingBook(token);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-[60vh]">
                <Loader />
            </div>
        );
    }

    const handleDelete = (id: string) => {
        setSelectedBookId(id);
        setConfirmationModal(true);
    };

    return (
        <section className={clsx('w-full', 'md:w-[80%]', 'flex', 'flex-col', 'gap-6')}>
            <div className={clsx('rounded-2xl', 'bg-white', 'p-4', 'shadow-lg', 'sm:p-6')}>
                <BookTable
                    books={books}
                    onDelete={handleDelete}
                />
                <BookListMobile
                    books={books}
                    openBookId={openBookId}
                    setOpenBookId={setOpenBookId}
                    onDelete={handleDelete} />
            </div>

            <Pagination
                currentPage={page}
                limit={limit}
                totalCount={totalCount}
                totalPages={totalPages} />

            {confirmationModal && (
                <ConfirmationModal
                    isOpen={confirmationModal}
                    message="Tem certeza que deseja excluir esta obra?"
                    onCancel={() => {
                        setConfirmationModal(false);
                        setSelectedBookId(null);
                    }}
                    onConfirm={handleDeleteBook}
                    title="Confirmação"
                />
            )}
            <FeedbackPopup
                status={submissionStatus}
                title={submissionStatus === 'success' ? 'Enviado' : 'Erro'}
                message={
                    submissionStatus === 'success'
                        ? 'Sua obra foi excluida com sucesso!'
                        : submitError ||
                        'Não foi possível excluir sua obra. Tente novamente mais tarde.'
                }
                onClose={handlePopupClose}
            />
        </section>
    );
}