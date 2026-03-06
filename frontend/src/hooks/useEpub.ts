"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ePub, { Book, Rendition, Location } from "epubjs";
import { UseEpubOptions, UseEpubReturn, NavigationState } from "@/types";
import { base64ToArrayBuffer } from "@/utils";

export const useEpub = ({
    fileData,
    title,
    viewerRef,
}: UseEpubOptions): UseEpubReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [navigation, setNavigation] = useState<NavigationState>({
        atStart: true,
        atEnd: false,
    });

    const bookRef = useRef<Book | null>(null);
    const renditionRef = useRef<Rendition | null>(null);
    const saveLocationTimeout = useRef<number | null>(null);

    // Funções de Navegação
    const nextPage = useCallback(() => {
        renditionRef.current?.next();
    }, []);

    const prevPage = useCallback(() => {
        renditionRef.current?.prev();
    }, []);

    // Efeito principal de carregamento do livro
    useEffect(() => {
        if (!viewerRef.current || !fileData) return;

        const viewerElement = viewerRef.current;
        viewerElement.innerHTML = ""; // Limpa o container
        setIsLoading(true);
        setError(null);
        setNavigation({ atStart: true, atEnd: false });

        let book: Book;
        try {
            const arrayBuffer = base64ToArrayBuffer(fileData);
            book = ePub(arrayBuffer);
            bookRef.current = book;
        } catch (e) {
            console.error("Erro ao carregar EPUB:", e);
            setError("Não foi possível carregar este livro.");
            setIsLoading(false);
            return;
        }

        const rendition = book.renderTo(viewerElement, {
            width: "100%",
            height: "100%",
            spread: "always",
            flow: "paginated",
        });
        renditionRef.current = rendition;

        // Registro de fontes (essencial estar aqui antes do display)
        rendition.themes.default({
            body: {
                padding: "2rem 1.5rem !important",
                "font-family": "Georgia, serif !important",
            },
        });
        rendition.themes.register("OpenDyslexic", {
            body: { "font-family": "'OpenDyslexic', sans-serif !important" },
        });

        // Evento de realocação (progresso e estado dos botões)
        rendition.on("relocated", (location: Location) => {
            setNavigation({
                atStart: location.atStart,
                atEnd: location.atEnd,
            });

            // Salvar progresso
            const storageKey = `epub-progress-${title}`;
            const currentLocationCfi = location.start.cfi;
            if (saveLocationTimeout.current) {
                clearTimeout(saveLocationTimeout.current);
            }
            saveLocationTimeout.current = window.setTimeout(() => {
                localStorage.setItem(storageKey, currentLocationCfi);
            }, 1000);
        });

        // Quando o livro estiver pronto, carregue o progresso
        book.ready
            .then(() => {
                const storageKey = `epub-progress-${title}`;
                const savedLocationCfi = localStorage.getItem(storageKey);

                let locationToDisplay: string | undefined =
                    savedLocationCfi || undefined;

                if (
                    !locationToDisplay &&
                    book.navigation.toc &&
                    book.navigation.toc.length > 0
                ) {
                    locationToDisplay = book.navigation.toc[0].href;
                }

                rendition.display(locationToDisplay);
                // O hook useEpubStyles vai cuidar de aplicar o estilo
                setIsLoading(false);
            })
            .catch((err: Error) => {
                console.error("Erro no book.ready:", err);
                setError("Não foi possível exibir este livro.");
                setIsLoading(false);
            });

        return () => {
            if (saveLocationTimeout.current) {
                clearTimeout(saveLocationTimeout.current);
            }
            book?.destroy();
            renditionRef.current = null;
            bookRef.current = null;
        };
    }, [fileData, title, viewerRef]);

    return { renditionRef, isLoading, error, navigation, nextPage, prevPage };
};
