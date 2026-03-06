import type { Metadata } from "next";
import { inter, playfairDisplay, OpenDyslexic } from "@/public/assets/fonts";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export const metadata: Metadata = {
    title: "Conectando Leitores",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body
                className={`${inter.variable} ${playfairDisplay.variable}${OpenDyslexic.variable} antialiased bg-gray-100`}
            >
                <AuthProvider>
                    <FavoritesProvider>
                        <Header />
                        {children}
                        <Footer />
                    </FavoritesProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
