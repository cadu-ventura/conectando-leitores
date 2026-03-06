import {
    SubmitHandler,
    UseFormRegister,
    FieldErrors,
    UseFormSetValue,
} from "react-hook-form";
import { ReactNode } from "react";
import { BookRegisterUserInputs } from "@/lib/bookSchema";
export interface UseRegisterBookFormReturn {
    // React Hook Form
    register: UseFormRegister<BookRegisterUserInputs>;
    handleSubmit: (
        callback: SubmitHandler<BookRegisterUserInputs>,
    ) => (e?: React.BaseSyntheticEvent) => void;
    errors: FieldErrors<BookRegisterUserInputs>;
    setValue: UseFormSetValue<BookRegisterUserInputs>;

    // Estados e controle
    isAdmin?: boolean;
    fileName: string | null;
    setFileName: React.Dispatch<React.SetStateAction<string | null>>;
    coverName: string | null;
    setCoverName: React.Dispatch<React.SetStateAction<string | null>>;
    categoryValue: string;
    setCategoryValue: React.Dispatch<React.SetStateAction<string>>;
    items: { value: string }[];

    // Funções auxiliares
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: SubmitHandler<BookRegisterUserInputs>;
    isDraggingCover: boolean;
    setIsDraggingCover: React.Dispatch<React.SetStateAction<boolean>>;
    isDraggingFile: boolean;
    setIsDraggingFile: React.Dispatch<React.SetStateAction<boolean>>;
    handleDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
    handleDropCover: (e: React.DragEvent<HTMLLabelElement>) => void;
    handleDropFile: (e: React.DragEvent<HTMLLabelElement>) => void;
}
export interface BookRegisterFormProps {
    handleCancel: () => void;
    setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface DescriptionOptions {
    value: string;
}
export interface PendingBookProviderProps {
    children: ReactNode;
    token: string;
}

export interface PendingBooksProps {
    token: string;
}
