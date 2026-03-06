"use client";

interface EpubErrorProps {
    error: string | null;
}

export const EpubError = ({ error }: EpubErrorProps) => {
    if (!error) return null;

    return (
        <div className="w-full max-w-6xl p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-red-300 text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">
                Ocorreu um Erro
            </h1>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
    );
};
