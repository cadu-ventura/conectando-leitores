"use client";

import { useEffect, useCallback } from "react";
import { Rendition } from "epubjs";
import { StyleProps } from "../types";
import { applyStylesToViews } from "../utils";

interface UseEpubStylesProps extends StyleProps {
    renditionRef: React.MutableRefObject<Rendition | null>;
    isLoading: boolean;
}

export const useEpubStyles = ({
    renditionRef,
    theme,
    fontSize,
    fontFamily,
    isLoading,
}: UseEpubStylesProps) => {
    // 1. Callback para aplicar estilos quando o "chunk" é renderizado
    const onRendered = useCallback(() => {
        applyStylesToViews(renditionRef.current, {
            theme,
            fontSize,
            fontFamily,
        });
    }, [renditionRef, theme, fontSize, fontFamily]);

    // 2. Anexa o "espião" onRendered ao rendition
    useEffect(() => {
        const currentRendition = renditionRef.current;
        if (currentRendition) {
            currentRendition.on("rendered", onRendered);
            return () => {
                currentRendition.off("rendered", onRendered);
            };
        }
    }, [renditionRef, onRendered]);

    // 3. Aplica estilos imediatamente quando as props mudam
    useEffect(() => {
        if (isLoading || !renditionRef.current) return;

        applyStylesToViews(renditionRef.current, {
            theme,
            fontSize,
            fontFamily,
        });
    }, [isLoading, renditionRef, theme, fontSize, fontFamily]);
};
