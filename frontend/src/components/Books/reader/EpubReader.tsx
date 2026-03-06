"use client";

import { useRef } from "react";
import { EpubReaderProps } from "@/types";
import { useEpub, useEpubStyles, useEpubKeyboard } from "@/hooks";
import {
    EpubError,
    EpubLoadingOverlay,
    EpubNavigation,
    EpubTitleHeader,
} from "@/components/ui";
import clsx from "clsx";

export default function EpubReader({
    title,
    author,
    fileData,
    fontSize,
    theme,
    fontFamily,
}: EpubReaderProps) {
    const viewerRef = useRef<HTMLDivElement>(null);

    const { renditionRef, isLoading, error, navigation, nextPage, prevPage } =
        useEpub({
            fileData,
            title,
            viewerRef,
        });

    useEpubStyles({
        renditionRef,
        theme,
        fontSize,
        fontFamily,
        isLoading,
    });

    useEpubKeyboard({
        isLoading,
        nextPage,
        prevPage,
    });

    if (error) {
        return <EpubError error={error} />;
    }

    return (
        <div className="w-full max-w-6xl">
            <EpubTitleHeader title={title} author={author} />

            <div
                className={clsx(
                    "w-full h-[600px] md:h-[700px] overflow-hidden relative rounded-lg",
                    "bg-white shadow-lg dark:bg-[#575757]",
                )}
            >
                <EpubLoadingOverlay isLoading={isLoading} />
                <div id="viewer" ref={viewerRef} className="w-full h-full" />
            </div>

            <EpubNavigation
                isLoading={isLoading}
                atStart={navigation.atStart}
                atEnd={navigation.atEnd}
                onPrev={prevPage}
                onNext={nextPage}
            />
        </div>
    );
}
