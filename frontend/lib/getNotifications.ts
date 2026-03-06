import { NotificationResponse } from "@/types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getNotifications(token: string): Promise<NotificationResponse[]> {
    try {
        const res = await fetch(`${API_URL}/notification`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store", // evita cache
        });

        if (!res.ok) {
            console.error("Erro ao buscar notificações:", res.statusText);
            return [];
        }
        const data = await res.json();

        // Garante que sempre retorna um array
        return Array.isArray(data) ? data : (data?.notifications ?? []);
    } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        return [];
    }
}