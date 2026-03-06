"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, ExternalBookResult } from "@/types";
import { catalogService } from "./catalogService";

type ActionResult =
    | { success: true; data: ExternalBookResult[] }
    | { success: false; error: string };

export async function searchBookAction(query: string): Promise<ActionResult> {
    let token: string | undefined;

    try {
        const cookieStore = await cookies();
        token = cookieStore.get("authToken")?.value;

        if (!token) {
            return { success: false, error: "Não autorizado" };
        }

        const decodedToken: DecodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
            return { success: false, error: "Sessão expirada" };
        }
    } catch (error) {
        console.error("Token inválido na Server Action:", error);
        return { success: false, error: "Token inválido" };
    }
    try {
        const results = await catalogService.searchBooks(query, token);

        return { success: true, data: results };
    } catch (error) {
        console.error("Erro ao chamar catalogService:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Erro interno do servidor" };
    }
}
