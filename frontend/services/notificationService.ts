const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const notificationService = {
    async getAll(token: string) {
        const response = await fetch(`${API_URL}/api/notification`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar notificações (${response.status})`);
        }

        return await response.json();
    },
    async readNotification(id: string, token: string) {
        const response = await fetch(`${API_URL}/api/notification/${id}/read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Erro ao marcar notificação como lida (${response.status})`,
            );
        }

        return await response.json();
    },
};
