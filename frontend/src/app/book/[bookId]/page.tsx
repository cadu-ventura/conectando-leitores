// src/app/book/[bookId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";

import BookReaderHeader from "@/components/Books/reader/BookReaderHeader";
import BookReaderFooter from "@/components/Books/reader/BookReaderFooter";
import EpubReader from "@/components/Books/reader";
import Loader from "@/components/ui/Loader";

interface BookData {
    title: string;
    author: string;
    contentType: string;
    file: string;
}

type Theme = "light" | "dark";
type FontFamily = "default" | "dyslexic";

export default function BookPage() {
    const params = useParams();
    const bookId = params.bookId as string;
    const { token } = useAuth();

    const [bookData, setBookData] = useState<BookData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [fontSize, setFontSize] = useState(16);
    const [theme, setTheme] = useState<Theme>("light");
    const [fontFamily, setFontFamily] = useState<FontFamily>("default");

    const toggleTheme = () =>
        setTheme((t) => (t === "light" ? "dark" : "light"));
    const toggleFontFamily = () =>
        setFontFamily((f) => (f === "default" ? "dyslexic" : "default"));

    useEffect(() => {
        if (!bookId || !token) {
            if (!token) {
                setError("Você precisa estar logado para ler este livro.");
                setIsLoading(false);
            }
            return;
        }

        async function fetchBookData() {
            setIsLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setError(
                    "Erro de configuração: A URL da API não foi definida.",
                );
                setIsLoading(false);
                return;
            }

            const externalApiUrl = `${apiUrl}/book/${bookId}`;

            try {
                const res = await fetch(externalApiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401)
                    throw new Error(
                        "Não autorizado (401). Verifique seu token.",
                    );
                if (!res.ok)
                    throw new Error(
                        `Falha ao buscar o livro (Status: ${res.status})`,
                    );

                const data = await res.json();
                setBookData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Erro desconhecido",
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchBookData();
    }, [bookId, token]);

    useEffect(() => {
        const htmlElement = document.documentElement;
        if (theme === "dark") {
            htmlElement.classList.add("dark");
        } else {
            htmlElement.classList.remove("dark");
        }

        return () => {
            htmlElement.classList.remove("dark");
        };
    }, [theme]);

    return (
        <div className={clsx("flex flex-col min-h-screen")}>
            <BookReaderHeader
                theme={theme}
                fontFamily={fontFamily}
                onToggleTheme={toggleTheme}
                onToggleFontFamily={toggleFontFamily}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
            />

            <main className="flex flex-col items-center justify-center w-full py-8 dark:bg-[#434343] flex-grow px-3.5">
                {isLoading ? (
                    <Loader />
                ) : error || !bookData ? (
                    <div className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-center">
                        <h1 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">
                            Erro ao Carregar
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300">
                            {error || "Não foi possível encontrar o livro."}
                        </p>
                    </div>
                ) : (
                    <EpubReader
                        title={bookData.title}
                        author={bookData.author}
                        fileData={bookData.file}
                        fontSize={fontSize}
                        theme={theme}
                        fontFamily={fontFamily}
                    />
                )}
            </main>

            <BookReaderFooter />
        </div>
    );
}
