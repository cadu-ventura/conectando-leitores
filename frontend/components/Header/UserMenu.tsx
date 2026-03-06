"use client";

import { motion, type Variants } from "framer-motion";
import {
    X,
    Upload,
    Heart,
    MessageCircle,
    Bell,
    LogOut,
    ClipboardCheck,
    List,
    Trash2,
    UserPlus,
    UserX,
} from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/components/ui/MenuItem";
import type { User, MenuItem as MenuItemType } from "@/types";

interface UserMenuProps {
    user: User;
    logout: () => Promise<void>;
    onClose: () => void;
}
const normalUserMenuItems: MenuItemType[] = [
    {
        id: "cadastrar-livro",
        label: "Cadastrar livro ou inserir obras",
        icon: Upload,
        href: "/livros/upload",
    },
    {
        id: "meus-favoritos",
        label: "Meus favoritos",
        icon: Heart,
        href: "/meus-favoritos",
    },
    {
        id: "fale-conosco",
        label: "Fale conosco",
        icon: MessageCircle,
        href: "/contato",
    },
    {
        id: "notificacoes",
        label: "Notificações",
        icon: Bell,
        href: "/notificacoes",
    },
    { id: "sair", label: "Sair", icon: LogOut, href: "#logout" },
];
const adminMenuItems: MenuItemType[] = [
    {
        id: "admin-cadastrar-livro",
        label: "Cadastrar livros e inserir obras",
        icon: Upload,
        href: "/livros/upload",
    },
    {
        id: "admin-meus-favoritos",
        label: "Meus favoritos",
        icon: Heart,
        href: "/meus-favoritos",
    },
    {
        id: "admin-analisar-obras",
        label: "Analisar obras pendentes",
        icon: ClipboardCheck,
        href: "/admin/obras-pendentes",
    },
    {
        id: "admin-listar-livros",
        label: "Listagem dos livros",
        icon: List,
        href: "/admin/livros",
    },
    {
        id: "admin-excluir-usuarios",
        label: "Excluir usuários",
        icon: UserX,
        href: "/admin/excluir-usuarios",
    },
    {
        id: "admin-excluir-obras",
        label: "Excluir obras",
        icon: Trash2,
        href: "/admin/excluir-obras",
    },
    {
        id: "admin-cadastrar-admins",
        label: "Cadastrar novos administradores",
        icon: UserPlus,
        href: "/admin/novo",
    },
    {
        id: "admin-notificacoes",
        label: "Notificações",
        icon: Bell,
        href: "/notificacoes",
    },
    { id: "admin-sair", label: "Sair", icon: LogOut, href: "#logout" },
];
const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.15 } },
};

export function UserMenu({ user, logout, onClose }: UserMenuProps) {
    const handleLogoutClick = () => {
        onClose();
        logout();
    };
    const avatarUrl =
        user.imageUrl ||
        `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.username)}`;
    const menuItemsToRender = user.roles.includes("sysadmin")
        ? adminMenuItems
        : normalUserMenuItems;

    return (
        <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-4 md:right-4 z-50 flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-200/80 bg-white shadow-2xl
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-[90vw] left-4 sm:left-auto sm:right-4 "
        >
            {" "}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 pt-4 pb-6">
                {" "}
                <button
                    id="user-menu--close-button"
                    onClick={onClose}
                    className="absolute top-1 right-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:cursor-pointer"
                    aria-label="Fechar menu"
                >
                    <X size={24} />
                </button>{" "}
                <div className="mt-2 flex items-center justify-between">
                    {" "}
                    <div className="flex items-center gap-3">
                        {" "}
                        <Image
                            src={avatarUrl}
                            alt={`Foto de perfil de ${user.username}`}
                            width={56}
                            height={56}
                            className="rounded-full bg-gray-200 object-cover"
                            unoptimized={true}
                        />{" "}
                        <div>
                            {" "}
                            <p className="font-sans font-bold text-gray-800">
                                {user.username}
                            </p>{" "}
                            <p className="text-sm text-gray-500">
                                {user.mail}
                            </p>{" "}
                        </div>
                    </div>{" "}
                    <span className="rounded-lg px-2 py-1 mt-2 text-xs font-bold bg-primary/10 text-primary">
                        {user.roles.includes("sysadmin") ? "Admin" : "Usuário"}
                    </span>
                </div>
            </div>{" "}
            <nav className="flex-grow p-4">
                {menuItemsToRender.map((item) => (
                    <MenuItem
                        key={item.id}
                        id={`user-menu-${item.id}`}
                        icon={item.icon}
                        href={item.href !== "#logout" ? item.href : undefined}
                        onClick={
                            item.href === "#logout"
                                ? handleLogoutClick
                                : onClose
                        }
                        variant={item.href === "#logout" ? "danger" : "default"}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </nav>
        </motion.div>
    );
}
