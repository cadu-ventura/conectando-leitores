'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'

interface PaginationProps {
    currentPage: number
    totalPages: number
    limit: number
    totalCount: number
}

export default function Pagination({ currentPage, totalPages, limit, totalCount }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        const params = new URLSearchParams(searchParams)
        params.set('page', String(newPage))
        params.set('limit', String(limit))
        router.push(`${pathname}?${params.toString()}`)
    }

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCount);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <div className="flex w-full flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:gap-0">
                <p className="text-center text-sm sm:text-base">
                    Mostrando {startItem} - {endItem} de {totalCount} • Página{' '}
                    {currentPage} de {totalPages}
                </p>
                {/* Paginação */}
                <nav className="flex flex-wrap items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 hover:cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={clsx(
                                'flex',
                                'h-8',
                                'w-8',
                                'items-center',
                                'justify-center',
                                'rounded-lg',
                                'font-medium',
                                'transition-colors',
                                'hover:cursor-pointer',
                                currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'border border-purple-200 bg-white text-primary hover:bg-purple-50',
                            )}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 hover:cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>
                </nav>
            </div>
        </>
    )
}