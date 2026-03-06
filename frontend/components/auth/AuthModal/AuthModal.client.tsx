"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import AuthFormPanel from "./AuthFormPanel";
import { Loader } from "./sub-components";
import { backdropVariants, modalContainerVariants } from "./animations";
import type { AuthModalProps, ModalView } from "@/types";
import clsx from "clsx";

export default function AuthModalClient({
    isOpen,
    onClose,
    initialView = "login",
}: AuthModalProps) {
    const [view, setView] = useState<ModalView>(initialView);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignupDirty, setIsSignupDirty] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(
        null,
    );
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 150);
            return () => clearTimeout(timer);
        } else {
            setIsSignupDirty(false);
        }
    }, [isOpen, initialView]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleDirtyChange = (isDirty: boolean) => {
        setIsSignupDirty(isDirty);
    };

    const requestClose = useCallback(() => {
        if (view === "signup" && isSignupDirty) {
            setPendingAction(() => onClose);
            setShowConfirm(true);
        } else {
            onClose();
        }
    }, [isSignupDirty, view, onClose]);

    const requestViewChange = useCallback(
        (newView: ModalView) => {
            if (view === "signup" && isSignupDirty) {
                setPendingAction(() => () => setView(newView));
                setShowConfirm(true);
            } else {
                setView(newView);
            }
        },
        [isSignupDirty, view],
    );

    const handleConfirmAction = () => {
        if (pendingAction) pendingAction();
        setShowConfirm(false);
        setPendingAction(null);
    };

    const handleCancelAction = () => {
        setShowConfirm(false);
        setPendingAction(null);
    };

    const formContent = isLoading ? (
        <div
            className={clsx(
                "flex",
                "flex-grow",
                "items-center",
                "justify-center",
                "h-full",
            )}
        >
            <Loader />
        </div>
    ) : (
        <AuthFormPanel
            view={view}
            handleViewChange={requestViewChange}
            onClose={requestClose}
            onDirtyChange={handleDirtyChange}
        />
    );

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="auth-modal-backdrop"
                        key="modal-backdrop"
                        className={clsx(
                            "fixed",
                            "inset-0",
                            "bg-black/60",
                            "flex",
                            "justify-center",
                            "items-center",
                            "z-50",
                            "p-4",
                        )}
                        onClick={requestClose}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <motion.div
                            className={clsx(
                                "relative",
                                "w-full",
                                "max-w-md",
                                "rounded-2xl",
                                "bg-white",
                                "lg:max-w-6xl",
                                "lg:bg-transparent",
                            )}
                            onClick={(e) => e.stopPropagation()}
                            variants={modalContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {isDesktop ? (
                                <div
                                    className={clsx(
                                        "grid",
                                        "grid-cols-2",
                                        "gap-14",
                                        "p-8",
                                        "bg-[url(/bg-login.png)]",
                                        "bg-cover",
                                        "rounded-2xl",
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            "flex",
                                            "flex-col",
                                            "justify-between",
                                            "text-white",
                                            "pl-6",
                                            "pt-6",
                                            "pb-6",
                                        )}
                                    >
                                        {/* Conteúdo da Esquerda */}
                                        <div
                                            className={clsx(
                                                "flex",
                                                "items-center",
                                                "ml-6",
                                            )}
                                        >
                                            <Image
                                                src="/conectando-leitores.svg"
                                                alt="ícone de leitura"
                                                width={193}
                                                height={138}
                                                className="w-auto"
                                            />
                                        </div>
                                        <div
                                            className={clsx(
                                                "text-start",
                                                "mb-24",
                                                "ml-6",
                                            )}
                                        >
                                            <h1
                                                className={clsx(
                                                    "font-serif",
                                                    "font-bold",
                                                    "text-5xl",
                                                    "mb-[22px]",
                                                )}
                                            >
                                                Conectando leitores.
                                            </h1>
                                            <p className="text-2xl">
                                                A biblioteca comunitária
                                                digital!
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            "bg-white",
                                            "rounded-xl",
                                            "flex",
                                            "flex-col",
                                            "h-[85vh]",
                                            "overflow-hidden",
                                        )}
                                    >
                                        {formContent}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={clsx(
                                        "bg-white",
                                        "rounded-2xl",
                                        "max-h-[95dvh]",
                                        "flex",
                                        "flex-col",
                                    )}
                                >
                                    {formContent}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={showConfirm}
                onCancel={handleCancelAction}
                onConfirm={handleConfirmAction}
                title="Confirmação"
                message="Você tem certeza que quer cancelar o cadastro? Os dados inseridos serão perdidos."
            />
        </>
    );
}
