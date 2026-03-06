import DeletingBooks from "@/components/Books/Deleting/DeletingBooks";
import { cookies } from "next/headers";

export default async function DeletingBooksPage() {
    const token = (await cookies()).get("authToken")?.value;

    if (!token) return null;

    return (
        <main className="w-full flex flex-col items-center min-h-screen px-4 md:px-10 mt-5">
            <div className="w-full md:w-1/3 text-center mt-5 mb-5">
                <h1 className="text-primary text-2xl sm:text-3xl font-bold">
                    Excluir Obras
                </h1>
                <p className="mt-3 text-sm md:text-base">
                    Gerencie as obras que serão removidas do acervo digital. Certifique-se de que todos os critérios de
                    exclusão foram atendidos antes de concluir a ação.
                </p>
            </div>
            <DeletingBooks token={token} />
        </main>
    );
}