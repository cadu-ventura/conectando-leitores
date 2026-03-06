import HeaderClient from "./Header.client";
import { getCurrentUser } from "@/lib/auth";

export default async function Header() {
    const user = await getCurrentUser();

    return <HeaderClient initialUser={user} />;
}
