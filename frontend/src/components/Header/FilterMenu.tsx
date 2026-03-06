"use client";

import { useRef, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import type { FilterMenuProps } from "@/types";

type FilterMenuItem =
    | { type: "section"; title: string; items: string[] }
    | { type: "item"; title: string; href: string };

const baseMenuContent: FilterMenuItem[] = [
    {
        type: "section",
        title: "Categorias",
        items: [
            "Ficção",
            "Romance",
            "Poesia",
            "Contos",
            "Biografia",
            "Suspense",
            "Aventura",
            "Infantil",
            "Fábulas",
        ],
    },
    {
        type: "section",
        title: "Idiomas",
        items: ["Português", "Inglês", "Espanhol", "Francês"],
    },
];

export function FilterMenu({
    isOpen,
    onClose,
    anchorRef,
    user,
}: FilterMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const menuContent: FilterMenuItem[] = [...baseMenuContent];

    if (user) {
        if (user.roles.includes("sysadmin"))
            menuContent.push({
                type: "item",
                title: "Usuários cadastrados",
                href: "/admin/usuarios",
            });
        else
            menuContent.push({
                type: "item",
                title: "Leituras Recentes",
                href: "/leituras-recentes",
            });
    }

    const getPosition = () => {
        if (!anchorRef.current) return { top: 0, right: "100%" };
        const rect = anchorRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY + 8,
            right: window.innerWidth - rect.right,
        };
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-transparent"
                >
                    <motion.div
                        ref={menuRef}
                        onClick={(e: MouseEvent) => e.stopPropagation()}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            ...getPosition(),
                            position: "absolute",
                            left: "auto",
                        }}
                        className="w-64 bg-white rounded-lg shadow-xl border border-gray-200/80 z-50 p-6"
                    >
                        {" "}
                        <button
                            id="filter-menu-close-button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                            aria-label="Fechar filtro"
                        >
                            <X size={20} />
                        </button>{" "}
                        <h3 className="font-bold text-primary text-[clamp(1.5rem,1.3rem+0.8vw,1.875rem)]">
                            Filtro
                        </h3>{" "}
                        <hr className="my-4 border-gray-200" />{" "}
                        <div className="space-y-4">
                            {menuContent.map((section, index) => (
                                <div key={index}>
                                    {section.type === "section" && (
                                        <>
                                            {" "}
                                            <h4 className="font-bold text-gray-800 mb-2 text-[clamp(0.875rem,0.8rem+0.3vw,1rem)]">
                                                {section.title}
                                            </h4>{" "}
                                            <ul className="space-y-1">
                                                {section.items.map((item) => (
                                                    <li
                                                        key={item}
                                                        className="text-gray-600 hover:text-primary cursor-pointer p-1 -m-1 rounded-md text-[clamp(0.875rem,0.8rem+0.3vw,1rem)]"
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    {section.type === "item" && (
                                        <Link
                                            href={section.href}
                                            onClick={onClose}
                                            className="font-bold text-gray-800 hover:text-primary cursor-pointer p-1 -m-1 rounded-md block text-[clamp(0.875rem,0.8rem+0.3vw,1rem)]"
                                        >
                                            {section.title}
                                        </Link>
                                    )}
                                    {index < menuContent.length - 1 && (
                                        <hr className="mt-4 border-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
