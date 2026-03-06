import { RawUser, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
    deleteUser: async (
        id: string,
        token: string | null,
        justification: string,
    ) => {
        const endpointUrl = `${API_URL}/user/delete/${id}`;
        try {
            if (!token) throw new Error("Usuário não autenticado");

            const response = await fetch(endpointUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ justification }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Erro ao deletar usuário: ${errText}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            return { success: false };
        }
    },

    getUsers: async ({
        page,
        limit,
        token,
    }: {
        page: number;
        limit: number;
        token: string | undefined;
    }): Promise<{ users: User[]; totalCount: number }> => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));

        const endpointUrl = `${API_URL}/user?${params.toString()}`;

        try {
            if (!token) throw new Error("Token não fornecido");

            const response = await fetch(endpointUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const res = await response.json();

            const users = Array.isArray(res.data)
                ? res.data.map((u: RawUser) => ({
                      id: u._id ?? u.id,
                      username:
                          `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
                      mail: u.email ?? u.mail ?? "",
                      roles: Array.isArray(u.roles)
                          ? u.roles.join(", ")
                          : (u.roles ?? "usuário"),
                      imageUrl: u.imageUrl ?? undefined,
                      isAdmin: Array.isArray(u.roles)
                          ? u.roles.includes("admin")
                          : String(u.roles).includes("admin"),
                      lastAccess:
                          u.lastAccess ?? u.lastLogin ?? u.updatedAt ?? "",
                  }))
                : [];

            const totalCount = res.meta?.total ?? users.length;

            return { users, totalCount };
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return { users: [], totalCount: 0 };
        }
    },
};
