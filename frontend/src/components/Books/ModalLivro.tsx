"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "@/types";
import Image from "next/image";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/hooks/useAuth";

interface BookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
}

const Tag = ({
    text,
    primary = false,
}: {
    text: string;
    primary?: boolean;
}) => (
    <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            primary ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
        }`}
    >
        {text}
    </span>
);

const FavoriteButton = ({
    isFavorited,
    onClick,
    isLoading,
}: {
    isFavorited: boolean;
    onClick: () => void;
    isLoading: boolean;
}) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors w-fit disabled:opacity-50 disabled:cursor-wait hover:cursor-pointer"
    >
        {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
        ) : (
            <Heart
                size={20}
                className={`transition-all ${
                    isFavorited ? "fill-primary text-primary" : ""
                }`}
            />
        )}
        <span className="font-medium text-sm">
            {isLoading
                ? isFavorited
                    ? "Removendo..."
                    : "Favoritando..."
                : "Favoritar"}
        </span>
    </button>
);

const StarRating = ({
    bookRating,
    reviewCount,
    userRating,
    hoverRating,
    onHover,
    onClick,
}: {
    bookRating: number;
    reviewCount: number;
    userRating: number;
    hoverRating: number;
    onHover: (rate: number) => void;
    onClick: (rate: number) => void;
}) => {
    const displayRating = hoverRating || userRating;
    const ratingMessages: { [key: number]: string } = {
        1: "Não recomendo",
        2: "Regular",
        3: "Bom",
        4: "Muito bom",
        5: "Excelente",
    };
    const tooltipText = ratingMessages[displayRating] || "";
    return (
        <div>
            <p className="text-sm text-gray-600 mb-1">Avaliações</p>
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-gray-900">
                    {bookRating.toFixed(1)}
                </span>
                <div
                    className="flex items-center"
                    onMouseLeave={() => onHover(0)}
                    title={tooltipText}
                >
                    {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        return (
                            <Star
                                key={i}
                                size={18}
                                onMouseEnter={() => onHover(starValue)}
                                onClick={() => onClick(starValue)}
                                className={`cursor-pointer transition-colors ${
                                    starValue <= displayRating
                                        ? hoverRating
                                            ? "text-primary/50 fill-primary/50"
                                            : "text-primary fill-primary"
                                        : "text-gray-300"
                                }`}
                            />
                        );
                    })}
                </div>
                <span className="text-gray-500 text-sm">
                    ({reviewCount} avaliações)
                </span>
            </div>
        </div>
    );
};

export default function BookModal({ book, isOpen, onClose }: BookModalProps) {
    const router = useRouter(); // Inicializa o hook de navegação
    const { token, openAuthModal } = useAuth();
    const {
        isFavorite,
        toggleFavorite,
        isLoading: isLoadingFavorites,
    } = useFavorites();

    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const isFavorited = useMemo(
        () => (book ? isFavorite(book.id) : false),
        [isFavorite, book],
    );

    useEffect(() => {
        if (book) {
            setHoverRating(0);
            setUserRating(0);
        }
    }, [book]);

    if (!book || isLoadingFavorites) return null;

    const handleFavoriteClick = async () => {
        if (!token) {
            onClose();
            setTimeout(() => {
                openAuthModal("login");
            }, 150);
            return;
        }

        if (isTogglingFavorite) return;
        setIsTogglingFavorite(true);
        try {
            await toggleFavorite(book.id);
        } catch (error) {
            console.error("Erro no handleFavoriteClick:", error);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleRatingClick = (rate: number) => {
        if (!token) {
            onClose();
            setTimeout(() => openAuthModal("login"), 150);
            return;
        }
        setUserRating(rate);
    };

    const handleReadNow = () => {
        if (!token) {
            onClose();
            setTimeout(() => {
                openAuthModal("login");
            }, 150);
            return;
        }

        if (!book) return;
        onClose();
        router.push(`/book/${book.id}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
                            aria-label="Fechar modal"
                        >
                            <X size={24} />
                        </button>

                        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3 md:p-8">
                            <div className="flex items-start justify-center md:col-span-1">
                                <Image
                                    src={book.coverUrl}
                                    alt={book.title}
                                    width={153}
                                    height={227}
                                    className="h-auto w-full max-w-[280px] rounded-lg object-cover shadow-lg md:max-w-full"
                                    unoptimized={true}
                                />
                            </div>

                            <div className="flex flex-col space-y-6 md:col-span-2">
                                <div>
                                    <h2 className="text-4xl font-extrabold text-title-color">
                                        {book.title}
                                    </h2>
                                    <p className="mt-1 text-lg text-text-color">
                                        {book.author}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag text={book.category} primary />
                                    <Tag text={book.language} />
                                    <Tag text={String(book.publicationYear)} />
                                </div>

                                <FavoriteButton
                                    isFavorited={isFavorited}
                                    onClick={handleFavoriteClick}
                                    isLoading={isTogglingFavorite}
                                />

                                <StarRating
                                    bookRating={book.rating}
                                    reviewCount={book.reviewCount}
                                    userRating={userRating}
                                    hoverRating={hoverRating}
                                    onHover={setHoverRating}
                                    onClick={handleRatingClick}
                                />

                                <button
                                    onClick={handleReadNow}
                                    className="w-full rounded-lg bg-primary py-3 px-4 font-semibold text-white transition-colors hover:bg-tertiary text-base"
                                >
                                    Ler agora
                                </button>

                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-title-color">
                                        Sinopse
                                    </h3>
                                    <div className="space-y-4 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-text-color">
                                        {book.synopsis}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
