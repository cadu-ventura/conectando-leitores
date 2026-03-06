"use client";

import type { Book } from "@/types";
import CategoryTag from "@/components/ui/CategoryTag";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

interface Props {
    books: Book[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export default function BookListClient({
    books,
    totalCount,
    totalPages,
    currentPage,
    limit,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        params.set("limit", String(limit));
        router.push(`${pathname}?${params.toString()}`);
    };

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCount);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={clsx("flex", "flex-col", "gap-6", "min-h-screen")}>
            <div
                className={clsx(
                    "rounded-2xl",
                    "bg-white",
                    "p-4",
                    "shadow-lg",
                    "sm:p-6",
                )}
            >
                <table
                    className={clsx(
                        "hidden",
                        "w-full",
                        "table-auto",
                        "text-left",
                        "md:table",
                    )}
                >
                    <thead
                        className={clsx(
                            "border-b",
                            "border-gray-100",
                            "text-sm",
                            "font-semibold",
                            "text-black",
                        )}
                    >
                        <tr>
                            <th
                                className={clsx(
                                    "px-4",
                                    "py-4",
                                    "font-sans",
                                    "font-bold",
                                    "text-size-title",
                                )}
                            >
                                Título
                            </th>
                            <th
                                className={clsx(
                                    "px-4",
                                    "py-4",
                                    "font-sans",
                                    "font-bold",
                                    "text-size-title",
                                )}
                            >
                                Autor
                            </th>
                            <th
                                className={clsx(
                                    "px-4",
                                    "py-4",
                                    "font-sans",
                                    "font-bold",
                                    "text-size-title",
                                )}
                            >
                                Categoria
                            </th>
                        </tr>
                    </thead>
                    <tbody className={clsx("divide-y", "divide-gray-100")}>
                        {books.map((book) => (
                            <tr
                                key={book.id}
                                className={clsx("hover:bg-gray-50")}
                            >
                                <td
                                    className={clsx(
                                        "flex",
                                        "items-center",
                                        "gap-3",
                                        "px-4",
                                        "py-4",
                                    )}
                                >
                                    <BookOpen
                                        size={18}
                                        className="text-black"
                                    />
                                    <span
                                        className={clsx(
                                            "text-size-h5",
                                            "font-bold",
                                            "text-black",
                                        )}
                                    >
                                        {book.title}
                                    </span>
                                </td>
                                <td
                                    className={clsx(
                                        "px-4",
                                        "py-4",
                                        "text-size-h5",
                                        "text-black",
                                    )}
                                >
                                    {book.author}
                                </td>
                                <td className={clsx("px-4", "py-4")}>
                                    <CategoryTag text={book.category} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    className={clsx("divide-y", "divide-gray-100", "md:hidden")}
                >
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className={clsx(
                                "flex",
                                "items-center",
                                "justify-between",
                                "py-4",
                            )}
                        >
                            <div
                                className={clsx(
                                    "flex",
                                    "items-center",
                                    "gap-4",
                                )}
                            >
                                <BookOpen
                                    size={20}
                                    className={clsx(
                                        "flex-shrink-0",
                                        "text-black",
                                    )}
                                />
                                <div>
                                    <p
                                        className={clsx(
                                            "font-bold",
                                            "text-black",
                                        )}
                                    >
                                        {book.title}
                                    </p>
                                    <p
                                        className={clsx(
                                            "text-sm",
                                            "text-black",
                                        )}
                                    >
                                        {book.author}
                                    </p>
                                </div>
                            </div>
                            <div className={clsx("flex-shrink-0")}>
                                <CategoryTag text={book.category} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={clsx(
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-between",
                    "gap-4",
                    "text-sm",
                    "text-black",
                    "md:flex-row",
                )}
            >
                <p>
                    Mostrando {startItem} - {endItem} de {totalCount} • Página{" "}
                    {currentPage} de {totalPages}
                </p>

                <nav className={clsx("flex", "items-center", "gap-2")}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={clsx(
                            "flex",
                            "h-8",
                            "w-8",
                            "items-center",
                            "justify-center",
                            "rounded-lg",
                            "bg-primary",
                            "text-white",
                            "transition-colors",
                            "hover:bg-primary/90",
                            "disabled:opacity-50",
                        )}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={clsx(
                                "flex",
                                "h-8",
                                "w-8",
                                "items-center",
                                "justify-center",
                                "rounded-lg",
                                "font-medium",
                                "transition-colors",
                                currentPage === page
                                    ? "bg-primary text-white"
                                    : "border border-purple-200 bg-white text-primary hover:bg-purple-50",
                            )}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={clsx(
                            "flex",
                            "h-8",
                            "w-8",
                            "items-center",
                            "justify-center",
                            "rounded-lg",
                            "bg-primary",
                            "text-white",
                            "transition-colors",
                            "hover:bg-primary/90",
                            "disabled:opacity-50",
                        )}
                        aria-label="Próxima página"
                    >
                        <ChevronRight size={16} />
                    </button>
                </nav>
            </div>
        </div>
    );
}
