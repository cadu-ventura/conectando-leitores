import { useMemo, useEffect, useState } from "react";
import { DeletingUserResponse, User } from "@/types/user";
import { useSearchParams } from "next/navigation";
import { userService } from "@/services/userService";

export function useDeletingUsers(token: string | null): DeletingUserResponse {
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const totalPages = useMemo(
        () => Math.ceil(totalCount / limit),
        [totalCount, limit],
    );

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await userService.getUsers({ page, limit, token });
                setUsers(data.users);
                setTotalCount(data.totalCount);
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, page, limit]);

    const handleDeleteUser = async (justification: string) => { 
    if (!token || !selectedUserId) return;

    try {
        const result = await userService.deleteUser(selectedUserId, token, justification);

        if (result.success) {
            setUsers(prev => prev.filter(user => user.id !== selectedUserId));
            setConfirmationModal(false);
            setSelectedUserId(null);
        } else {
            console.error("Erro ao deletar:", result);
        }
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
    }
};

    return {
        users,
        totalCount,
        totalPages,
        page,
        limit,
        confirmationModal,
        setConfirmationModal,
        openUserId,
        setOpenUserId,
        selectedUserId,
        setSelectedUserId,
        handleDeleteUser,
        loading,
    };
}
