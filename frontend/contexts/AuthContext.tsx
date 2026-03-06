"use client";

import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
    useContext,
} from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";
import type { LoginFormInputs } from "@/lib/validations";
import { jwtDecode } from "jwt-decode";
import type { User, DecodedToken, ModalView } from "@/types";
import { useRouter } from "next/navigation";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginFormInputs) => Promise<void>;
    logout: () => Promise<void>;

    isAuthModalOpen: boolean;
    authModalView: ModalView;
    openAuthModal: (view: ModalView) => void;
    closeAuthModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<ModalView>("login");

    const clearSession = () => {
        setUser(null);
        setToken(null);
        Cookies.remove("authToken");
        localStorage.removeItem("authUser");
    };

    useEffect(() => {
        const loadUserFromCookie = async () => {
            const storedToken = Cookies.get("authToken");
            if (storedToken) {
                try {
                    await authService.validateToken(storedToken);
                    const decodedToken = jwtDecode<DecodedToken>(storedToken);
                    const rolesFromToken = (decodedToken.roles || "")
                        .split(",")
                        .map((r: string) => r.trim())
                        .filter((r: string) => r.length > 0);
                    const userFromToken: User = {
                        id: decodedToken.sub,
                        mail: decodedToken.mail,
                        roles: rolesFromToken,
                        username: decodedToken.mail.split("@")[0],
                        isAdmin: rolesFromToken.includes("sysadmin"),
                    };
                    const storedUserJson = localStorage.getItem("authUser");
                    if (storedUserJson) {
                        const fullUser = JSON.parse(storedUserJson);
                        setUser(fullUser);
                    } else {
                        setUser(userFromToken);
                    }
                    setToken(storedToken);
                } catch (validationError) {
                    console.error(
                        "Sessão inválida ou expirada, limpando cookie:",
                        validationError,
                    );
                    clearSession();
                }
            }
            setIsLoading(false);
        };
        loadUserFromCookie();
    }, []);

    const login = useCallback(async (credentials: LoginFormInputs) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login(credentials);
            const decodedToken = jwtDecode<DecodedToken>(data.access_token);
            const userToStore: User = {
                id: decodedToken.sub,
                username: data.user.fullName,
                roles: data.user.roles
                    ? data.user.roles.split(",").map((r: string) => r.trim())
                    : [],
                mail: decodedToken.mail,
                isAdmin: data.user.roles
                    ? data.user.roles.split(",").includes("sysadmin")
                    : false,
            };
            setToken(data.access_token);
            setUser(userToStore);
            Cookies.set("authToken", data.access_token, {
                expires: 1,
                secure: process.env.NODE_ENV === "production",
                path: "/",
            });
            localStorage.setItem("authUser", JSON.stringify(userToStore));

            setIsAuthModalOpen(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocorreu um erro inesperado.",
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        if (token) {
            try {
                await authService.logout(token);
            } catch (err) {
                console.error("Falha ao fazer logout no servidor:", err);
            }
        }
        clearSession();
        router.push("/");
    }, [token, router]);

    const openAuthModal = useCallback((view: ModalView) => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
    }, []);

    const value = {
        user,
        token,
        isLoading,
        error,
        login,
        logout,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
