"use client";

import { X } from "lucide-react";
import { Button } from "./button";
import { RejectingUserInput, RejectingUserSchema } from "@/lib/bookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface DeleteModalProps {
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export default function DeleteUserModal({ onConfirm, onCancel }: DeleteModalProps) {
    const titleJustify = [
        { text: "Uso indevido da plataforma" },
        { text: "Comportamento inadequado" },
        { text: "Violação de direitos autorais" },
        { text: "Fraudes ou irregularidades cadastrais" },
        { text: "Inatividade prolongada" },
        { text: "Descumprimento do regulamento da biblioteca" },
        { text: "Solicitação do próprio usuário" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RejectingUserInput>({
        resolver: zodResolver(RejectingUserSchema),
    });

    const onSubmit = (data: RejectingUserInput) => {
        onConfirm(data.justification); // <--- passa a justificativa pro hook
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative bg-white rounded-xl w-[90%] max-w-md shadow-2xl p-6 space-y-5 animate-fadeIn">
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <X size={20} className="hover:cursor-pointer" />
                </button>

                <h1 className="text-primary text-2xl font-bold mt-2 text-start">
                    Tem certeza ?
                </h1>
                <p className="text-sm text-gray-700">
                    Tem certeza que deseja excluir este usuário? Essa ação não poderá ser desfeita
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label htmlFor="justify" className="text-sm mb-1">
                            Justificativa*
                        </label>
                        <select
                            id="justify"
                            defaultValue=""
                            {...register("justification")}
                            className={`border rounded-md p-2 focus:outline-primary hover:cursor-pointer ${errors.justification ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="" disabled hidden>
                                Selecione uma justificativa
                            </option>
                            {titleJustify.map(({ text }) => (
                                <option key={text} value={text}>
                                    {text}
                                </option>
                            ))}

                        </select>

                        {errors.justification && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.justification.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">

                        <Button type="submit" className="hover:cursor-pointer px-8">
                            Sim
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary border-primary bg-white hover:cursor-pointer px-8"
                            onClick={onCancel}
                        >
                            Não
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}