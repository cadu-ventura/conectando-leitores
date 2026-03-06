import { Rendition } from "epubjs";

// Propriedades que o componente principal recebe da página
export interface EpubReaderProps {
    title: string;
    author: string;
    fileData: string; // Base64
    fontSize: number;
    theme: "light" | "dark";
    fontFamily: "default" | "dyslexic";
}

// Tipos internos do EpubJS que usamos
export interface EpubView {
    document?: Document;
}

// Tipo para o estado de navegação
export interface NavigationState {
    atStart: boolean;
    atEnd: boolean;
}

// Tipo para as funções de utilidade de estilo
export interface StyleProps {
    theme: "light" | "dark";
    fontFamily: "default" | "dyslexic";
    fontSize: number;
}

// Propriedades que o hook useEpub precisa
export interface UseEpubOptions {
    fileData: string;
    title: string; // Usado para a chave do localStorage
    viewerRef: React.RefObject<HTMLDivElement | null>;
}

// O que o hook useEpub retorna
export interface UseEpubReturn {
    renditionRef: React.MutableRefObject<Rendition | null>;
    isLoading: boolean;
    error: string | null;
    navigation: NavigationState;
    nextPage: () => void;
    prevPage: () => void;
}
