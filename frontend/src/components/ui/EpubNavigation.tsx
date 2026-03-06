"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

// Interface para as props que este componente espera
interface EpubNavigationProps {
    isLoading: boolean;
    atStart: boolean; // Está no começo do livro?
    atEnd: boolean; // Está no fim do livro?
    onPrev: () => void; // Função para chamar ao clicar em "anterior"
    onNext: () => void; // Função para chamar ao clicar em "próximo"
}

export const EpubNavigation = ({
    isLoading,
    atStart,
    atEnd,
    onPrev,
    onNext,
}: EpubNavigationProps) => {
    return (
        <footer className="flex justify-between items-center w-full max-w-4xl mt-6 px-4 mx-auto">
            {/* Botão Anterior */}
            <button
                onClick={onPrev}
                disabled={isLoading || atStart}
                aria-label="Página anterior"
                className={clsx(
                    "p-3 rounded-full transition-colors duration-200",
                    // Estilos de Habilitado
                    "text-purple-600 hover:bg-purple-100",
                    "dark:text-purple-300 dark:hover:bg-gray-700",
                    // Estilos de Desabilitado
                    "disabled:text-gray-400 disabled:hover:bg-transparent",
                    "dark:disabled:text-gray-600 dark:disabled:hover:bg-transparent",
                )}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Botão Próximo */}
            <button
                onClick={onNext}
                disabled={isLoading || atEnd}
                aria-label="Próxima página"
                className={clsx(
                    "p-3 rounded-full transition-colors duration-200",
                    // Estilos de Habilitado
                    "text-purple-600 hover:bg-purple-100",
                    "dark:text-purple-300 dark:hover:bg-gray-700",
                    // Estilos de Desabilitado
                    "disabled:text-gray-400 disabled:hover:bg-transparent",
                    "dark:disabled:text-gray-600 dark:disabled:hover:bg-transparent",
                )}
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </footer>
    );
};
