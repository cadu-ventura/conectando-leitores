"use client";

import clsx from "clsx";

interface EpubTitleHeaderProps {
    title: string;
    author: string;
}

export const EpubTitleHeader = ({ title, author }: EpubTitleHeaderProps) => {
    return (
        <header className="text-center mb-6 w-full">
            <h1
                className={clsx(
                    "text-3xl md:text-4xl font-extrabold mb-2 truncate",
                    "text-gray-800 dark:text-gray-100",
                )}
                title={title}
            >
                {title}
            </h1>
            <p
                className={clsx(
                    "text-lg md:text-xl",
                    "text-gray-600 dark:text-gray-400",
                )}
            >
                {author}
            </p>
        </header>
    );
};
