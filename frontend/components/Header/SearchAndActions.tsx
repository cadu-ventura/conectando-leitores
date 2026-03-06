"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Funnel, X, LoaderCircle, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Portal from "@/components/ui/Portal";
import { FilterMenu } from "./FilterMenu";
import { UserMenu } from "./UserMenu";
import type { User, ExternalBookResult, UserActionsProps } from "@/types";
import { searchBookAction } from "@/services/searchActions";

type SearchResult = ExternalBookResult;

export function SearchBar({
    user,
    containerClassName = "w-[464px]",
}: {
    user: User | null;
    containerClassName?: string;
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isAuthenticated = !!user;

    useEffect(() => {
        if (!isAuthenticated) {
            setResults([]);
            return;
        }
        if (query.length < 2) {
            setResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const result = await searchBookAction(query);

                if (result.success) {
                    setResults(result.data);
                } else {
                    console.error("Falha na busca:", result.error);
                    setResults([]);
                }
            } catch (error) {
                console.error("Erro ao chamar Server Action:", error);
                setResults([]);
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, isAuthenticated]);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="flex items-center gap-1.5" ref={searchContainerRef}>
                <div className={`relative z-50 ${containerClassName}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Search size={24} className="text-primary" />
                    </div>

                    <input
                        id="search-bar--input"
                        type="search"
                        placeholder={
                            isAuthenticated
                                ? "Pesquise pelo título ou autor do livro.."
                                : "Faça login para pesquisar"
                        }
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={!isAuthenticated}
                        className="w-full pl-11 pr-10 py-[7.5px] border border-primary/50 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:outline-none text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        autoComplete="off"
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isLoading ? (
                            <LoaderCircle
                                size={20}
                                className="animate-spin text-primary"
                            />
                        ) : (
                            <AnimatePresence>
                                {query && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center"
                                    >
                                        <button
                                            id="search-bar--clear-button"
                                            type="button"
                                            onClick={() => setQuery("")}
                                            aria-label="Limpar busca"
                                            className="p-1 bg-primary text-white rounded-md hover:bg-primary/90"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>

                    <AnimatePresence>
                        {isAuthenticated && results.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                            >
                                {results.map((book) => (
                                    <li key={book._id}>
                                        <Link
                                            href={`/book/${book._id}`}
                                            onClick={() => {
                                                setQuery("");
                                                setResults([]);
                                            }}
                                            className="block p-3 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div className="font-bold text-gray-800">
                                                {book.title}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {book.author}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    id="search-bar--filter-button"
                    ref={filterButtonRef}
                    onClick={() => setIsFilterOpen((p) => !p)}
                    className="flex items-center gap-1.5 p-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex-shrink-0 hover:cursor-pointer"
                >
                    <Funnel size={20} />
                    <span className="hidden xl:inline font-bold text-[clamp(0.875rem,0.8rem+0.3vw,1rem)]">
                        Filtro
                    </span>
                </button>
            </div>

            <Portal>
                <FilterMenu
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    anchorRef={filterButtonRef}
                    user={user}
                />
            </Portal>
        </>
    );
}

export function UserActions({
    isLoading,
    user,
    logout,
    openModal,
    isUserMenuOpen,
    toggleUserMenu,
}: UserActionsProps) {
    useEffect(() => {
        document.body.style.overflow = isUserMenuOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isUserMenuOpen]);

    if (isLoading)
        return (
            <div className="w-28 h-9 flex items-center justify-center">
                <LoaderCircle size={20} className="animate-spin text-primary" />
            </div>
        );

    if (user) {
        const avatarUrl =
            user.imageUrl ||
            `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.username)}`;
        return (
            <>
                {" "}
                <button
                    id="user-actions-menu-button"
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2.5 p-2.5 border border-primary/15 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer"
                >
                    <Menu size={32} className="text-primary" />
                    <Image
                        src={avatarUrl}
                        alt={`Avatar de ${user.username}`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover bg-gray-200"
                        unoptimized={true}
                    />
                </button>{" "}
                <Portal>
                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <>
                                {" "}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={toggleUserMenu}
                                    className="fixed inset-0 bg-black/40 z-40"
                                />{" "}
                                <UserMenu
                                    user={user}
                                    logout={logout}
                                    onClose={toggleUserMenu}
                                />{" "}
                            </>
                        )}
                    </AnimatePresence>
                </Portal>{" "}
            </>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {" "}
            <button
                id="user-actions-signup-button"
                onClick={() => openModal("signup")}
                className="font-bold text-primary transition-colors hover:text-primary/80 md:text-tertiary
         md:hover:text-tertiary/80 text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] hover:cursor-pointer"
            >
                <span className="md:hidden">Criar</span>
                <span className="hidden md:inline">Criar conta</span>
            </button>{" "}
            <button
                id="user-actions-login-button"
                onClick={() => openModal("login")}
                className="font-bold py-2 px-5 rounded-lg bg-primary text-white hover:bg-secondary
        text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] hover:cursor-pointer"
            >
                Fazer Login
            </button>{" "}
        </div>
    );
}
