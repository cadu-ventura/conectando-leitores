"use client";

import Marquee from "react-fast-marquee";
import CardLivro from "../CardLivro";
import type { Book } from "@/types";
import { useBookModal } from "@/contexts/BookModalContext";

type SectionClientProps = {
    title: string;
    books: Book[];
};

export default function SectionLivrosClient({
    title,
    books,
}: SectionClientProps) {
    const { isModalOpen } = useBookModal();
    const extendedBooks = [...books, ...books];

    return (
        <section className="mb-12">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-purple-700">
                    {title}
                </h2>
            </div>

            <div>
                <Marquee
                    play={!isModalOpen}
                    pauseOnHover={true}
                    speed={60}
                    gradient={false}
                >
                    {extendedBooks.map((book, index) => (
                        <div
                            key={`${book.id}-${index}`}
                            className="mr-[26px] py-10"
                        >
                            <CardLivro book={book} />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
