'use client';

import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import clsx from "clsx";
import CategoryTag from "@/components/ui/CategoryTag";
import { User } from "@/types";

interface UserListMobileProps {
    users: User[];
    selectedUserId: string | null;
    onToggle: (id: string | null) => void;
    onDelete: (id: string) => void;
}

export default function UserListMobile({
    users,
    selectedUserId,
    onToggle,
    onDelete,
}: UserListMobileProps) {
    return (
        <div className="divide-y divide-gray-100 md:hidden">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="relative flex flex-col items-start justify-center py-4 text-sm"
                >
                    <button
                        onClick={() => onToggle(selectedUserId === user.id ? null : user.id)}
                        className="absolute top-4 right-0 hover:cursor-pointer"
                    >
                        {selectedUserId === user.id ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    <div className="flex items-center gap-4 w-full justify-start">
                        <BookOpen size={18} className="text-black" />
                        <div className="text-start">
                            <p className="font-bold text-black">{user.username}</p>
                            <p className="text-xs text-black">{user.mail}</p>
                        </div>
                    </div>

                    {selectedUserId === user.id && (
                        <div className="mt-4 w-full space-y-4">
                            <div className="ml-8">
                                <p className="text-sm font-bold">Tipo de acesso:</p>
                                <div className="capitalize">
                                    <CategoryTag text={user.roles} />
                                </div>
                            </div>
                            <div className="ml-8">
                                <p className="font-bold">Último acesso:</p>
                                {user.lastAccess
                                    ? new Date(user.lastAccess).toLocaleDateString("pt-BR", {
                                        dateStyle: "short",
                                    })
                                    : "—"}
                            </div>
                            <button
                                onClick={() => onDelete(user.id)}
                                className={clsx(
                                    "w-full py-2 font-bold rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors hover:cursor-pointer"
                                )}
                            >
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
