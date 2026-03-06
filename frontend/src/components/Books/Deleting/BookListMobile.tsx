'use client';

import clsx from "clsx";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import CategoryTag from "@/components/ui/CategoryTag";
import { Book } from "@/types";

interface BookListMobileProps {
    books: Book[];
    openBookId: string | null;
    setOpenBookId: (id: string | null) => void;
    onDelete: (id: string) => void;
}

export default function BookListMobile({ books, openBookId, setOpenBookId, onDelete }: BookListMobileProps) {
    return (
        <div className={clsx('divide-y', 'divide-gray-100', 'md:hidden')}>
            {books.map(book => (
                <div key={book.id} className={clsx('relative', 'flex', 'flex-col', 'items-start', 'justify-center', 'py-4', 'text-sm')}>

                    {/* Botão da seta fixo no canto */}
                    <button
                        onClick={() => setOpenBookId(openBookId === book.id ? null : book.id)}
                        className="absolute top-4 right-4 hover:cursor-pointer z-10"
                    >
                        {openBookId === book.id ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {/* Conteúdo do livro com espaço para a seta */}
                    <div className="flex items-center gap-4 w-full pr-10">
                        <BookOpen size={18} className="text-black" />
                        <div className="text-start break-words">
                            <p className="font-bold text-black">{book.title}</p>
                            <p className="text-xs text-black">{book.author}</p>
                        </div>
                    </div>

                    {openBookId === book.id && (
                        <div className="mt-4 w-full space-y-4">
                            <div className="ml-8">
                                <p className="text-sm font-bold">Categoria:</p>
                                <CategoryTag text={book.category} />
                            </div>
                            <button
                                onClick={() => onDelete(book.id)}
                                className={clsx(
                                    'w-[99%]', 'mx-auto', 'block', 'py-2', 'font-bold', 'rounded-lg', 'bg-red-700', 'text-white', 'hover:bg-red-800', 'transition-colors', 'hover:cursor-pointer'
                                )}
                                title="Excluir Obra"
                            >
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
