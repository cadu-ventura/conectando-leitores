"use client";

import Loader from "@/components/ui/Loader";
import clsx from "clsx";

interface EpubLoadingOverlayProps {
    isLoading: boolean;
}

export const EpubLoadingOverlay = ({ isLoading }: EpubLoadingOverlayProps) => {
    if (!isLoading) return null;

    return (
        <div
            className={clsx(
                "absolute inset-0 flex items-center justify-center z-10",
                "bg-white dark:bg-[#575757]",
            )}
        >
            <Loader />
        </div>
    );
};
