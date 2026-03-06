'use client';

import clsx from "clsx";
import { BookOpen, Trash2 } from "lucide-react";
import CategoryTag from "@/components/ui/CategoryTag";
import { Book } from "@/types";

interface BookTableProps {
    books: Book[];
    onDelete: (id: string) => void;
}

export default function BookTable({ books, onDelete}: BookTableProps) {
    return (
        <table className={clsx('hidden', 'w-full', 'table-auto', 'text-left', 'md:table')}>
            <thead className={clsx('border-b', 'border-gray-100', 'text-sm', 'font-semibold', 'text-black')}>
                <tr>
                    <th className={clsx('px-4', 'py-2', 'font-sans', 'font-bold', 'text-lg')}>Título</th>
                    <th className={clsx('px-4', 'py-2', 'font-sans', 'font-bold', 'text-lg')}>Autor</th>
                    <th className={clsx('px-4', 'py-2', 'font-sans', 'font-bold', 'text-lg')}>Categoria</th>
                    <th className={clsx('px-4', 'py-2', 'font-sans', 'font-bold', 'text-lg', 'text-right', 'w-1/12')}></th>
                </tr>
            </thead>
            <tbody className={clsx('divide-y', 'divide-gray-100')}>
                {books.map(book => (
                    <tr key={book.id} className={clsx('hover:bg-gray-50')}>
                        <td className={clsx('flex', 'items-center', 'gap-3', 'px-4', 'py-4')}>
                            <BookOpen size={18} className='text-black' />
                            <span className={clsx('text-md', 'font-bold', 'text-black')}>{book.title}</span>
                        </td>
                        <td className={clsx('px-4', 'py-4', 'text-md', 'text-black')}>{book.author}</td>
                        <td className={clsx('px-4', 'py-4')}><CategoryTag text={book.category} /></td>
                        <td className={clsx('px-4', 'py-4', 'text-right')}>
                            <button
                                onClick={() => onDelete(book.id)}
                                className={clsx(
                                    'p-2', 'rounded-lg', 'bg-red-700', 'text-white', 'hover:bg-red-800', 'transition-colors', 'hover:cursor-pointer'
                                )}
                                title="Excluir Obra"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
