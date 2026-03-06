import PendingBooks from "@/components/Books/Pending/PendingBooks";
import { cookies } from "next/headers";

export default async function ObrasPendentesPage() {
    const token = (await cookies()).get("authToken")?.value;

    if (!token) return null;

    return (
        <main className="w-full flex flex-col items-center min-h-screen px-4 md:px-10 mt-5">
            <div className="w-full md:w-1/3 text-center mt-5 mb-5">
                <h1 className="text-primary text-2xl sm:text-3xl font-bold">
                    Obras Pendentes
                </h1>
                <p className="mt-3 text-sm md:text-base">
                    Acompanhe o andamento das obras que ainda estão em fase de
                    processamento, revisão ou aprovação.
                </p>
            </div>
            <PendingBooks token={token} />
        </main>
    );
}
