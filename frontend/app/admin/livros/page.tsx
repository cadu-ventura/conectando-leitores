import { Suspense } from "react";
import BookListClient from "@/components/Books/BookListClient";
import EmptyState from "@/components/ui/EmptyState";
import { bookService } from "@/services/bookService";
import { BookOpenCheck } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Força a página a ser dinâmica, corrigindo erros de searchParams
export const dynamic = "force-dynamic";

const ListagemLoader = () => (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 shadow-lg">
        <Loader />
        <p className="mt-4 text-sm text-gray-500">Buscando livros...</p>
    </div>
);

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PaginaListagemLivros({
    searchParams,
}: PageProps) {
    // 1. Lemos o cookie (correto)
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("authToken"); // Troque 'authToken' pelo nome real
    const token = tokenCookie?.value;

    if (!token) {
        redirect("/");
    }

    // 2. Lemos 'page' e 'limit' dos searchParams *antes* de chamar o serviço
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 10;

    // 3. --- A CORREÇÃO ---
    // Passamos as *variáveis* page, limit, e token
    // em vez do objeto 'searchParams'
    const { books, totalCount } = await bookService.getBooks({
        page,
        limit,
        token, // Passando o token que lemos
    });
    // --- FIM DA CORREÇÃO ---

    if (totalCount === 0) {
        return (
            <div className="w-full px-4 lg:px-[122px] ">
                <EmptyState
                    icon={<BookOpenCheck size={48} />}
                    title="Nenhuma obra cadastrada"
                    message="Ainda não há livros cadastrados na plataforma. Assim que forem adicionados, eles aparecerão aqui."
                />
            </div>
        );
    }

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="w-full px-4 lg:px-[122px] min-h-screen">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary">
                    Listagem de livros
                </h1>
                <p className="mt-2 text-gray-500">
                    Visualize todos os livros cadastrados na plataforma e
                    mantenha o acervo sempre atualizado.
                </p>
            </div>

            <Suspense fallback={<ListagemLoader />}>
                <BookListClient
                    books={books}
                    totalCount={totalCount}
                    totalPages={totalPages}
                    currentPage={page}
                    limit={limit}
                />
            </Suspense>
        </div>
    );
}
