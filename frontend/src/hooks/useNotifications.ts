"use client";
import { useEffect, useState } from "react";
import { notificationService } from "@/services/notificationService";
import { NotificationResponse } from "@/types/notification";

export const useNotifications = (token: string | null) => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>(
        [],
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getAll(token);
                setNotifications(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [token]);

    const markAsRead = async (id: string) => {
        try {
            if (!token) return;

            await notificationService.readNotification(id, token);

            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
            );
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
        }
    };

    return { notifications, loading, markAsRead };
};