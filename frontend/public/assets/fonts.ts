import localFont from "next/font/local";

// Fonte principal para o corpo do texto (sans-serif)
export const inter = localFont({
    src: [
        {
            path: "../fonts/inter-v19-latin-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/inter-v19-latin-700.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-inter", // Nome da variável CSS que será criada
});

// Fonte para títulos e destaques (serif)
export const playfairDisplay = localFont({
    src: [
        {
            path: "../fonts/playfair-display-v39-latin-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/playfair-display-v39-latin-700.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-playfair-display", // Variável CSS para a outra fonte
});

export const OpenDyslexic = localFont({
    src: [
        {
            path: "../fonts/OpenDyslexic-Regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-opendyslexic", // Variável CSS para a outra fonte
});
