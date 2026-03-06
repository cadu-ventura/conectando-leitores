"use client";

import { useEffect, useRef } from "react";
import { PAGE_TURN_COOLDOWN } from "@/utils";

interface UseEpubKeyboardProps {
    isLoading: boolean;
    nextPage: () => void;
    prevPage: () => void;
}

export const useEpubKeyboard = ({
    isLoading,
    nextPage,
    prevPage,
}: UseEpubKeyboardProps) => {
    const pageTurnLock = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLoading || pageTurnLock.current) return;

            let turned = false;
            if (e.key === "ArrowRight") {
                nextPage();
                turned = true;
            } else if (e.key === "ArrowLeft") {
                prevPage();
                turned = true;
            }

            if (turned) {
                pageTurnLock.current = true;
                setTimeout(() => {
                    pageTurnLock.current = false;
                }, PAGE_TURN_COOLDOWN);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLoading, nextPage, prevPage]);
};
