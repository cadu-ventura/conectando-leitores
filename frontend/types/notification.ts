export interface NotificationResponse {
    _id: string;
    type: string;
    message: string;
    user: string;
    createdAt: string;
    read: boolean;
}

export interface NotificationItemProps {
    notification: NotificationResponse;
    onMarkAsRead: (id: string) => void;
}
