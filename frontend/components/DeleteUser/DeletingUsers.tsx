'use client';

import Pagination from "@/components/ui/Pagination";
import Loader from "@/components/ui/Loader";
import clsx from "clsx";
import { useDeletingUsers } from "@/hooks/useDeletingUsers";
import UserTable from "./UserTable";
import UserListMobile from "./UserListMobile";
import DeleteUserModal from "../ui/DeleteUserModal";

interface DeletingUsersPageProps {
    token: string | null;
}

export default function DeletingUsersPage({ token }: DeletingUsersPageProps) {
    const {
        totalCount,
        totalPages,
        page,
        limit,
        confirmationModal,
        setConfirmationModal,
        loading,
        users,
        selectedUserId,
        setSelectedUserId,
        handleDeleteUser
    } = useDeletingUsers(token);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-[60vh]">
                <Loader />
            </div>
        );
    }

    return (
        <section
            className={clsx(
                "w-full md:max-w-6xl mx-auto flex flex-col gap-8"
            )}
        >
            <div
                className={clsx(
                    "rounded-2xl bg-white p-4 md:p-6 shadow-lg overflow-x-auto"
                )}
            >
                <UserTable
                    users={users}
                    onDelete={(id) => {
                        setSelectedUserId(id);
                        setConfirmationModal(true);
                    }}
                    selectedUserId={selectedUserId}
                />

                <UserListMobile
                    users={users}
                    selectedUserId={selectedUserId}
                    onToggle={setSelectedUserId}
                    onDelete={(id) => {
                        setSelectedUserId(id);
                        setConfirmationModal(true);
                    }}
                />
            </div>

            <Pagination
                currentPage={page}
                limit={limit}
                totalCount={totalCount}
                totalPages={totalPages}
            />

            {confirmationModal && (
                <DeleteUserModal
                    onConfirm={handleDeleteUser}
                    onCancel={() => setConfirmationModal(false)}
                />
            )}
        </section>
    );
}