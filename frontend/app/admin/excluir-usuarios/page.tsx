import DeletingUsersPage from "@/components/DeleteUser/DeletingUsers";
import { cookies } from "next/headers";

export default async function DeletingUserPage() {
    const token = (await cookies()).get("authToken")?.value;

    if (!token) return null;

    return (
        <main className="w-full flex flex-col items-center min-h-screen px-4 md:px-10 mt-5">
            <div className="w-[70%] md:w-[30%] text-center mt-5 mb-5">
                <h1 className="text-primary text-2xl sm:text-3xl font-bold">
                    Excluir Usuários
                </h1>
                <p className="mt-3 text-sm md:text-base">
                    Controle as contas cadastradas na plataforma de forma simples e segura.
                </p>
            </div>
            <DeletingUsersPage token={token} />
        </main>
    );
}