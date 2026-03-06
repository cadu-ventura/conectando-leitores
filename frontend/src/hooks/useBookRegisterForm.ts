"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { bookRegisterService } from "@/services/bookRegisterService";
import {
    DescriptionOptions,
    UseRegisterBookFormReturn,
} from "@/types/bookRegister";
import { useModal } from "./useModal";
import {
    BookRegisterUserInputs,
    bookRegisterUserSchema,
} from "@/lib/bookSchema";

export const useRegisterBookForm = (
    setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    token: string,
): UseRegisterBookFormReturn => {
    const { user, isAdmin } = useModal();

    const form = useForm<BookRegisterUserInputs>({
        resolver: zodResolver(bookRegisterUserSchema),
    });

    const {
        reset,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    // estados de nome de arquivo
    const [fileName, setFileName] = useState<string | null>(null);
    const [coverName, setCoverName] = useState<string | null>(null);

    // estado de categoria
    const [categoryValue, setCategoryValue] = useState<string>("");

    // opções do select
    const items: DescriptionOptions[] = [
        { value: "Ficção" },
        { value: "Romance" },
        { value: "Poesia" },
        { value: "Contos" },
        { value: "Biografia" },
        { value: "Suspense" },
        { value: "Aventura" },
        { value: "Infantil" },
        { value: "Fábulas" },
        { value: "Outros" },
    ];

    // limpar formulário
    const clearForm = (): void => {
        reset();
        setFileName(null);
        setCoverName(null);
        const inputs = ["file-upload", "book-cover-upload"];
        inputs.forEach((id) => {
            const input = document.getElementById(id) as HTMLInputElement;
            if (input) input.value = "";
        });
        setCategoryValue("");
    };

    const onSubmit: SubmitHandler<BookRegisterUserInputs> = async (data) => {
        if (!token || !user) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            setLoading(true);
            await bookRegisterService.registerBook(data, token);
            setRegisterSucess(true);
            clearForm();
        } catch (err) {
            console.error("Erro ao enviar livro:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCoverChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5MB

        if (file.size > maxSize) {
            form.setError("cover", {
                type: "manual",
                message: "A capa deve ter no máximo 5MB.",
            });
            setCoverName(null);
            e.target.value = "";
            return;
        }

        form.clearErrors("cover");
        setValue("cover", file);

        const lastDotIndex = file.name.lastIndexOf(".");
        const name =
            lastDotIndex !== -1
                ? file.name.substring(0, lastDotIndex)
                : file.name;
        const ext =
            lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : "";

        setCoverName(`"${name}"${ext}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            form.setError("book", {
                type: "manual",
                message: "O arquivo ultrapassa o limite de 50MB.",
            });
            setFileName(null);
            e.target.value = "";
            return;
        }

        form.clearErrors("book");
        setValue("book", file);

        const lastDotIndex = file.name.lastIndexOf(".");
        const name =
            lastDotIndex !== -1
                ? file.name.substring(0, lastDotIndex)
                : file.name;
        const ext =
            lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : "";

        setFileName(`"${name}"${ext}`);
    };

    // estados para highlight do drag
    const [isDraggingCover, setIsDraggingCover] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    // funções para drag and drop genéricas
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropCover = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingCover(false);

        const file = e.dataTransfer.files[0];
        if (
            file &&
            ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
        ) {
            const fakeEvent: React.ChangeEvent<HTMLInputElement> = {
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleCoverChange(fakeEvent);
        }
    };

    const handleDropFile = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingFile(false);

        const file = e.dataTransfer.files[0];
        const maxSize = 50 * 1024 * 1024;

        if (!file) return;

        if (file.size > maxSize) {
            form.setError("book", {
                type: "manual",
                message: "O arquivo ultrapassa o limite de 50MB.",
            });
            setFileName(null);
            return;
        }

        if (
            [
                "application/pdf",
                "application/epub",
                "application/epub+zip",
            ].includes(file.type)
        ) {
            const fakeEvent: React.ChangeEvent<HTMLInputElement> = {
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleFileChange(fakeEvent);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        setValue,
        isAdmin,
        fileName,
        coverName,
        setFileName,
        setCoverName,
        categoryValue,
        setCategoryValue,
        items,
        handleFileChange,
        handleCoverChange,
        onSubmit,
        isDraggingCover,
        setIsDraggingCover,
        isDraggingFile,
        setIsDraggingFile,
        handleDragOver,
        handleDropCover,
        handleDropFile,
    };
};
