"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ALargeSmall, Moon, Type, Sun } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface BookReaderHeaderProps {
    theme: "light" | "dark";
    fontFamily: "default" | "dyslexic";
    onToggleTheme: () => void;
    onToggleFontFamily: () => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
}

const fontSteps = [14, 16, 18, 20, 24];
const stepLabels = [
    "Pequena",
    "Normal",
    "Grande",
    "Muito grande",
    "Extra grande",
];

export default function BookReaderHeader({
    theme,
    fontFamily,
    onToggleTheme,
    onToggleFontFamily,
    fontSize,
    onFontSizeChange,
}: BookReaderHeaderProps) {
    const router = useRouter();
    const isDark = theme === "dark";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getThumbPosition = useCallback(() => {
        const index = fontSteps.indexOf(fontSize);
        if (index === -1) return "0%";
        return `${(index / (fontSteps.length - 1)) * 100}%`;
    }, [fontSize]);
    const getLabelForSize = useCallback((size: number) => {
        const index = fontSteps.indexOf(size);
        return index !== -1 ? stepLabels[index] : "";
    }, []);
    const handleDotClick = useCallback(
        (size: number) => {
            onFontSizeChange(size);
        },
        [onFontSizeChange],
    );
    const handleInterromperClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmExit = () => {
        setIsModalOpen(false);
        router.push("/");
    };

    const handleCancelExit = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <header className={clsx("w-full  dark:bg-[#434343]")}>
                <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <Link
                        href="/"
                        className="md:flex items-center gap-2 hidden"
                    >
                        <Image
                            src="/favicon.svg"
                            alt="Ícone Conectando Leitores"
                            width={58}
                            height={66}
                            priority
                            className="dark:brightness-0 dark:invert"
                        />
                        <div className="hidden md:flex md:flex-col  ">
                            <span
                                className={clsx(
                                    "font-bold",
                                    "text-xs",
                                    "uppercase",
                                    "text-primary",
                                    "dark:text-white",
                                    "leading-tight",
                                )}
                            >
                                Conectando
                            </span>
                            <span
                                className={clsx(
                                    "font-bold",
                                    "text-xs",
                                    "uppercase",
                                    "text-primary",
                                    "dark:text-white",
                                    "leading-tight",
                                )}
                            >
                                Leitores
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button
                                    title="Mudar tamanho da fonte"
                                    className={clsx(
                                        "p-2 rounded-full",
                                        "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white",
                                    )}
                                >
                                    <ALargeSmall size={24} />
                                </button>
                            </Popover.Trigger>

                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={10}
                                    className={clsx(
                                        "z-50 w-64 rounded-lg shadow-xl border p-6",
                                        "bg-white dark:bg-[#434343] dark:border-gray-700",
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            "relative flex items-center h-8 w-full",
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "absolute h-1 left-2 right-2 rounded-full",
                                                isDark
                                                    ? "bg-gray-600"
                                                    : "bg-gray-300",
                                            )}
                                        />
                                        <div
                                            className={clsx(
                                                "absolute h-1 left-2 rounded-full transition-all duration-300 ease-in-out",
                                                "bg-purple-300 dark:bg-purple-400",
                                            )}
                                            style={{
                                                width: getThumbPosition(),
                                            }}
                                        />

                                        {fontSteps.map((size, index) => {
                                            const isActive = size <= fontSize;
                                            const isCurrent = size === fontSize;
                                            const position = `${(index / (fontSteps.length - 1)) * 100}%`;

                                            return (
                                                <div
                                                    key={size}
                                                    className="absolute flex flex-col items-center cursor-pointer"
                                                    style={{
                                                        left: position,
                                                        transform:
                                                            "translateX(-50%)",
                                                    }}
                                                    onClick={() =>
                                                        handleDotClick(size)
                                                    }
                                                >
                                                    <div
                                                        className={clsx(
                                                            "w-4 h-4 rounded-full border-2 transition-colors duration-200 flex items-center justify-center",
                                                            isCurrent
                                                                ? isDark
                                                                    ? "bg-primary border-primary" //
                                                                    : "bg-white border-primary shadow-sm"
                                                                : !isActive
                                                                  ? isDark
                                                                      ? "bg-gray-600 border-gray-500"
                                                                      : "bg-gray-300 border-gray-300"
                                                                  : isDark
                                                                    ? "bg-gray-500 border-gray-500"
                                                                    : "bg-gray-300 border-gray-300",
                                                        )}
                                                    >
                                                        {/* Bolinha interna (Miolo) */}
                                                        <div
                                                            className={clsx(
                                                                "w-2 h-2 rounded-full",
                                                                // Miolo do PONTO ATUAL (Thumb)
                                                                isCurrent
                                                                    ? isDark
                                                                        ? "bg-white"
                                                                        : "bg-primary"
                                                                    : // Miolo dos PONTOS ATIVOS (Antes do thumb)
                                                                      isActive
                                                                      ? isDark
                                                                          ? "bg-purple-400"
                                                                          : "bg-primary"
                                                                      : // Miolo dos PONTOS INATIVOS (Depois do thumb)
                                                                        isDark
                                                                        ? "bg-gray-500"
                                                                        : "bg-gray-400",
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Pop-up de Label (Tooltip) */}
                                        <div
                                            className="absolute -top-10 left-0 transition-transform duration-300 ease-in-out"
                                            style={{ left: getThumbPosition() }}
                                        >
                                            <div
                                                className={clsx(
                                                    "relative px-3 py-1 rounded-lg shadow-md whitespace-nowrap -translate-x-1/2",
                                                    isDark
                                                        ? "bg-primary text-white"
                                                        : "bg-white text-primary border border-gray-200",
                                                )}
                                            >
                                                {getLabelForSize(fontSize)}
                                                <div
                                                    className={clsx(
                                                        "absolute bottom-0 left-1/2 w-3 h-3 -mb-1 transform -translate-x-1/2 rotate-45",
                                                        isDark
                                                            ? "bg-primary"
                                                            : "bg-white",
                                                        !isDark &&
                                                            "border-b border-r border-gray-200",
                                                    )}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        <button
                            onClick={onToggleTheme}
                            title="Alternar Modo Noturno"
                            className={clsx(
                                "p-2 rounded-full",
                                "text-gray-700 hover:text-primary dark:text-white dark:hover:text-gray-200",
                            )}
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>

                        <button
                            onClick={onToggleFontFamily}
                            title="Alternar fonte para dislexia"
                            className={clsx(
                                "p-2 rounded-full",
                                "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white",
                                fontFamily === "dyslexic" &&
                                    (isDark ? "text-white" : "text-primary"),
                            )}
                        >
                            <Type size={24} />
                        </button>

                        <button
                            onClick={handleInterromperClick}
                            className={clsx(
                                "py-2 px-4 rounded-lg text-sm",
                                "bg-primary text-white hover:bg-secondary",
                                "dark:bg-white dark:text-[#434343] dark:hover:bg-gray-400",
                            )}
                        >
                            Interromper leitura
                        </button>
                    </div>
                </div>
            </header>

            <ConfirmationModal
                isOpen={isModalOpen}
                title="Confirmação"
                message="Tem certeza que deseja interromper a leitura?"
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
                confirmText="Sim"
                cancelText="Não"
            />
        </>
    );
}
