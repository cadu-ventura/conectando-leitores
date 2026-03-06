"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import AuthModal from "@/components/auth/AuthModal";
import { Menu } from "lucide-react";
import { SearchBar, UserActions } from "./SearchAndActions";

import type { User } from "@/types";
import clsx from "clsx";

interface HeaderClientProps {
    initialUser: User | null;
}

export default function HeaderClient({ initialUser }: HeaderClientProps) {
    const {
        user,
        isLoading,
        isAuthModalOpen,
        authModalView,
        isUserMenuOpen,
        toggleUserMenu,
        openAuthModal,
        closeAuthModal,
        handleLogout,
    } = useHeader(initialUser);

    const pathname = usePathname() ?? "/";
    const isHomePage = pathname === "/";
    const isBookPage = pathname.startsWith("/book/");

    if (isBookPage) {
        return null;
    }

    return (
        <>
            <header
                className={clsx(
                    "relative",
                    "z-30",
                    "w-full",
                    "bg-gray-100",
                    "backdrop-blur-md",
                    "md:px-10",
                )}
            >
                <div
                    className={clsx(
                        "container",
                        "mx-auto",
                        "px-4",
                        "sm:px-6",
                        "py-3",
                    )}
                >
                    {/* Layout Desktop (XL) */}
                    <div
                        className={clsx(
                            "hidden",
                            "xl:flex",
                            "justify-between",
                            "items-center",
                        )}
                    >
                        <Link
                            href="/"
                            className={clsx("flex", "items-center", "gap-2")}
                        >
                            <Image
                                src="/favicon.svg"
                                alt="Ícone Conectando Leitores"
                                width={58}
                                height={66}
                                priority
                            />
                            <div className="flex flex-col">
                                <span
                                    className={clsx(
                                        "font-bold",
                                        "text-xs",
                                        "uppercase",
                                        "text-primary",
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
                                        "leading-tight",
                                    )}
                                >
                                    Leitores
                                </span>
                            </div>
                        </Link>

                        <div className={clsx("flex", "items-center", "gap-7")}>
                            {isHomePage && <SearchBar user={user} />}
                            <UserActions
                                isLoading={isLoading}
                                user={user}
                                logout={handleLogout}
                                openModal={openAuthModal}
                                isUserMenuOpen={isUserMenuOpen}
                                toggleUserMenu={toggleUserMenu}
                            />
                        </div>
                    </div>

                    {/* Layout Mobile */}
                    <div
                        className={clsx(
                            "flex",
                            "flex-col",
                            "gap-3",
                            "xl:hidden",
                        )}
                    >
                        <div
                            className={clsx(
                                "flex",
                                "justify-between",
                                "items-center",
                            )}
                        >
                            <Link href="/">
                                <Image
                                    src="/favicon.svg"
                                    alt="Ícone Conectando Leitores"
                                    width={32}
                                    height={36}
                                    priority
                                />
                            </Link>
                            <div className={clsx("flex", "items-center")}>
                                {user ? (
                                    <button
                                        id="header-mobile-menu-button"
                                        onClick={toggleUserMenu}
                                        className={clsx("p-2", "text-primary")}
                                    >
                                        <Menu size={28} />
                                    </button>
                                ) : (
                                    <UserActions
                                        isLoading={isLoading}
                                        user={null}
                                        logout={handleLogout}
                                        openModal={openAuthModal}
                                        isUserMenuOpen={isUserMenuOpen}
                                        toggleUserMenu={toggleUserMenu}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            {isHomePage && (
                                <SearchBar
                                    user={user}
                                    containerClassName={clsx("w-full")}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                initialView={authModalView}
            />
        </>
    );
}
