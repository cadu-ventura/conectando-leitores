"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePendingBookContext } from "@/contexts/PendingBookContext";
import { RejectingBookInput, RejectingBookSchema } from "@/lib/bookSchema";

export const usePendingBookHook = () => {
    const { setDeleteModalOpen, rejectingBook } = usePendingBookContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RejectingBookInput>({
        resolver: zodResolver(RejectingBookSchema),
    });

    const onSubmit = (data: RejectingBookInput) => {
        rejectingBook(data.justification);
        reset();
        setDeleteModalOpen(false);
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
    };
};
