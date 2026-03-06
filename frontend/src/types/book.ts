import { Dispatch, SetStateAction } from "react";

export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    language: string;
    coverUrl: string;
    publicationYear: number;
    rating: number;
    reviewCount: number;
    isFavorited: boolean;
    synopsis?: string;
    subtitulo?: string[];
}

export interface ApiBookListItem {
    _id: string;
    title: string;
    author: string;
    category: string;
    description?: string;
    coverUrl: string;
}

export interface ApiBookListResponse {
    page: number;
    limit: number;
    total: number;
    livros: ApiBookListItem[];
}

export interface BookListResponse {
    books: Book[];
    totalCount: number;
}

export interface ApiFavoriteItem {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    coverUrl: string;
}

export interface ApiFavoriteListMeta {
    total: number;
    page: number;
    lastPage: number;
    itemsPerPage: number;
}

export interface ApiFavoriteListResponse {
    data: ApiFavoriteItem[];
    meta: ApiFavoriteListMeta;
    message: string;
}

export interface ApiMostFavoritedItem {
    _id: string;
    title: string;
    author: string;
    category: string;
    coverUrl: string;
    favoriteCount: number;
    description?: string;
}

export interface ApiMostFavoritedResponse {
    mensagem: string;
    total: number;
    dados: ApiMostFavoritedItem[];
}

export interface MyFavoriteBooksPageProps {
    token: string;
}

export interface PendingBookCardProps {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    releaseDate: string;
    uploadedBy: string;
    uploadedByName?: string;
    status: string;
    coverUrl: string;
}
export interface PendingBookContextData {
    showActions: string | null;
    setShowActions: React.Dispatch<React.SetStateAction<string | null>>;
    deleteModalOpen: boolean;
    setDeleteModalOpen: (value: boolean) => void;
    approvingBook: (id: string) => void;
    rejectingBook: (justify?: string) => void;
    pendingBooks: PendingBookCardProps[];
    setPendingBooks: React.Dispatch<
        React.SetStateAction<PendingBookCardProps[]>
    >;
    setSelectedBookId: React.Dispatch<React.SetStateAction<string | null>>;
    loading: boolean;
    expanded: string | null;
    handleSetExpanded: (value: string | null) => void;
}

export interface DeletingBookResponse {
    books: Book[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
    confirmationModal: boolean;
    setConfirmationModal: Dispatch<SetStateAction<boolean>>;
    openBookId: string | null;
    setOpenBookId: Dispatch<SetStateAction<string | null>>;
    selectedBookId: string | null;
    setSelectedBookId: Dispatch<SetStateAction<string | null>>;
    handleDeleteBook: () => Promise<void>;
    loading: boolean;
    submissionStatus: "idle" | "success" | "error";
    setSubmissionStatus: Dispatch<SetStateAction<"idle" | "success" | "error">>;
    submitError: string | null;
    setSubmitError: Dispatch<SetStateAction<string | null>>;
    handlePopupClose: () => void;
}

export interface ExternalBookResult {
    _id: string;
    title: string;
    author: string;
    category: string;
}
