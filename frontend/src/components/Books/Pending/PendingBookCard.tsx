"use client";
import { Button } from "@/components/ui/button";
import { PendingBookCardProps } from "@/types";
import { Calendar, User, Menu } from "lucide-react";
import { usePendingBookContext } from "@/contexts/PendingBookContext";
import Image from "next/image";
import Link from "next/link";

export default function PendingBookCard({
    _id,
    title,
    author,
    category,
    description,
    releaseDate,
    uploadedBy,
    uploadedByName,
    coverUrl,
}: PendingBookCardProps) {
    const {
        showActions,
        setShowActions,
        approvingBook,
        setDeleteModalOpen,
        setSelectedBookId,
        expanded,
        handleSetExpanded
    } = usePendingBookContext();

    const handleRejectClick = () => {
        setSelectedBookId(_id);
        setDeleteModalOpen(true);
    };

    return (
        <section className="flex flex-col md:flex-row shadow-lg rounded-2xl bg-white p-5 w-full max-w-6xl gap-6 relative">
            <Link href={`/book/${_id}`} target="_blank" rel="noopener noreferrer" >
                <Image
                    src={coverUrl}
                    alt={`Capa do livro ${title}`}
                    width={150}
                    height={150}
                    className="w-36 h-36 md:w-40 md:h-55 rounded-lg object-cover self-start border hover:cursor-pointer"
                    unoptimized={true}
                />
            </Link>
            <div className="flex-1 flex flex-col justify-between space-y-3 mb-12 md:mb-0 relative">
                <div>
                    <Link href={`/book/${_id}`} target="_blank" rel="noopener noreferrer">
                        <h2 className="font-bold text-base md:text-lg hover:cursor-pointer">{title}</h2>
                    </Link>
                    <h3 className="text-gray-500 text-sm md:text-base">{author}</h3>
                    <span className="w-fit px-3 py-1 rounded-md bg-secondary/30 text-primary text-sm">
                        {category}
                    </span>
                    <div className="mt-4 mb-4">
                        <p
                            className={`w-full md:w-1/2 text-sm md:text-base transition-all duration-300 ease-in-out ${expanded === _id ? "" : "line-clamp-3"
                                }`}
                        >
                            {description}
                        </p>
                        <span
                            onClick={() => handleSetExpanded(_id)}
                            className="font-semibold cursor-pointer"
                        >
                            {expanded === _id ? "Ver menos" : "Ver mais"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between md:justify-start gap-2 md:space-x-10 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                        <User className="text-primary" size={20} />
                        <p>
                            Enviado por: <span className="font-bold">{uploadedByName || uploadedBy}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-primary" size={20} />
                        <p>
                            Data:
                            <span>
                                {new Date(releaseDate).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </span>
                        </p>
                    </div>
                </div>
                {/* Botões mobile */}
                {showActions === _id && (
                    <div className="flex flex-col gap-2 mt-4 md:hidden animate-fadeIn">
                        <Button
                            onClick={() => approvingBook(_id)}
                            className="bg-green-600 hover:bg-green-700 w-full"
                        >
                            Aprovar
                        </Button>
                        <Button
                            onClick={handleRejectClick}
                            className="bg-red-600 hover:bg-red-700 w-full "
                        >
                            Rejeitar
                        </Button>
                    </div>
                )}

                {/* Botões desktop */}
                <div className="hidden md:w-1/3 md:flex flex-col gap-3 absolute top-0 right-0 mb-5 mr-5">
                    <Button
                        onClick={() => approvingBook(_id)}
                        className="bg-green-600 hover:bg-green-700 px-8 hover:cursor-pointer"
                    >
                        Aprovar
                    </Button>
                    <Button
                        onClick={handleRejectClick}
                        className="bg-red-600 hover:bg-red-700 px-8 hover:cursor-pointer"
                    >
                        Rejeitar
                    </Button>
                </div>
            </div>

            {/* Menu mobile */}
            <button
                onClick={() => setShowActions((prev: string | null) => (prev === _id ? null : _id))}
                className="md:hidden absolute bottom-0 left-0 right-0 bg-primary text-white rounded-b-2xl py-2 flex justify-center items-center"
            >
                <Menu size={20} />
            </button>
        </section >
    );
}