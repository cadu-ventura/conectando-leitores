'use client';

import { BookOpen, Trash2 } from "lucide-react";
import clsx from "clsx";
import CategoryTag from "@/components/ui/CategoryTag";
import { User } from "@/types";

interface UserTableProps {
    users: User[];
    onDelete: (id: string) => void;
    selectedUserId: string | null;
}

export default function UserTable({ users, onDelete }: UserTableProps) {
    return (
        <table
            className={clsx(
                "hidden md:table w-full table-auto text-left border-collapse"
            )}
        >
            <thead
                className={clsx(
                    "border-b border-gray-200 text-sm font-semibold text-black"
                )}
            >
                <tr className="text-lg">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Tipo de acesso</th>
                    <th className="px-4 py-3 text-right">Último acesso</th>
                    <th className="px-4 py-3 text-right w-[80px]"></th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 flex items-center gap-3">
                            <BookOpen size={18} className="text-black" />
                            <span className="font-bold text-black">{user.username}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-800">{user.mail}</td>
                        <td className="px-4 py-4 capitalize">
                            <CategoryTag text={user.roles} />
                        </td>
                        <td className="py-4 text-center text-gray-700">
                            {user.lastAccess
                                ? new Date(user.lastAccess).toLocaleDateString("pt-BR", {
                                    dateStyle: "short",
                                })
                                : "—"}
                        </td>
                        <td className="px-4 py-4 text-right">
                            <button
                                onClick={() => onDelete(user.id)}
                                className={clsx(
                                    "p-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors hover:cursor-pointer"
                                )}
                                title="Excluir usuário"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
