"use client";

import { X } from "lucide-react";
import { Button } from "./button";
import { usePendingBookContext } from "@/contexts/PendingBookContext";
import { usePendingBookHook } from "@/hooks/usePendingBookHook";

export default function DeleteModal() {
    const { setDeleteModalOpen } = usePendingBookContext();
    const { register, handleSubmit, onSubmit, errors } = usePendingBookHook();

    const titleJustify = [
        { value: "inadequado", text: "Conteúdo inadequado" },
        { value: "incompativel", text: "Incompatível com a proposta" },
        { value: "plagio", text: "Plágio ou direitos autorais" },
        { value: "erro-texto", text: "Erros de qualidade textual" },
        { value: "arq-corrompido", text: "Arquivo corrompido" },
        { value: "inconsistencia", text: "Inconsistência de informações" },
        { value: "acessibilidade", text: "Problemas de acessibilidade " },
        { value: "capa-inadequada", text: "Capa inadequada" },
        { value: "incorreto", text: "Categoria incorreta" },
        { value: "duplicado", text: "Obra duplicada" },
    ]

    return (
        <div className="relative bg-white rounded-xl w-[90%] max-w-md shadow-lg p-6 space-y-5">
            <button
                onClick={() => setDeleteModalOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
                <X size={20} className="hover:cursor-pointer" />
            </button>

            <h1 className="text-primary text-2xl font-bold mt-2">Rejeitar Obra</h1>

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
                        {titleJustify.map(({ value, text }) => (
                            <option key={value} value={text}>
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
                    <Button
                        type="button"
                        variant="outline"
                        className="text-primary border-primary bg-white hover:cursor-pointer"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="hover:cursor-pointer">
                        Rejeitar
                    </Button>
                </div>
            </form>
        </div>
    );
}
