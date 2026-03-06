import { Dispatch, SetStateAction } from "react";

export interface User {
    id: string;
    username: string;
    mail: string;
    roles: string | string[];
    imageUrl?: string;
    isAdmin?: boolean;
    lastAccess?: string;
}

export interface RawUser {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mail?: string;
    roles?: string[] | string;
    imageUrl?: string;
    lastAccess?: string;
    lastLogin?: string;
    updatedAt?: string;
}

export interface DeletingUserResponse {
    users: User[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
    confirmationModal: boolean;
    setConfirmationModal: Dispatch<SetStateAction<boolean>>;
    openUserId: string | null;
    setOpenUserId: Dispatch<SetStateAction<string | null>>;
    selectedUserId: string | null;
    setSelectedUserId: Dispatch<SetStateAction<string | null>>;
    handleDeleteUser: (justification: string) => Promise<void>;
    loading: boolean;
}
