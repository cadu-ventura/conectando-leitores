import { Rendition } from "epubjs";
import { EpubView, StyleProps } from "../types";

const PAGE_TURN_COOLDOWN = 300;
export { PAGE_TURN_COOLDOWN };

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

const getThemeCss = (theme: string, fontFamily: string) => {
    const font =
        fontFamily === "dyslexic"
            ? "'OpenDyslexic', sans-serif"
            : "'Georgia', serif";

    const styles = `
    body, p, li, h1, h2, h3, h4, h5, h6, span, div {
      font-family: ${font} !important;
    }
  `;

    if (theme === "dark") {
        return (
            styles +
            `
      body, p, li, h1, h2, h3, h4, h5, h6, span, div { color: #EAEAEA !important; background-color: transparent !important; }
      body { background-color: #575757 !important; }
      a { color: #d699ff !important; }
      h1, h2 { color: #ffffff !important; }
    `
        );
    }

    return (
        styles +
        `
    body, p, li, h1, h2, h3, h4, h5, h6, span, div { color: #333 !important; background-color: transparent !important; }
    body { background-color: #FFF !important; }
    a { color: #8a05be !import; }
    h1, h2 { color: #000 !important; }
  `
    );
};

export const applyStylesToViews = (
    rendition: Rendition | null,
    styles: StyleProps,
) => {
    if (!rendition || !rendition.themes) return;

    const { theme, fontSize, fontFamily } = styles;

    rendition.themes.fontSize(`${fontSize}px`);

    const fontName = fontFamily === "dyslexic" ? "OpenDyslexic" : "default";
    rendition.themes.font(fontName);

    rendition.views().forEach((view) => {
        const typedView = view as EpubView;
        try {
            const doc = typedView.document;
            if (!doc || !doc.head) return;

            let style = doc.getElementById("theme-styles");
            if (!style) {
                style = doc.createElement("style");
                style.id = "theme-styles";
                doc.head.appendChild(style);
            }
            style.innerHTML = getThemeCss(theme, fontFamily);
        } catch (e) {
            console.warn("ePub view style error (ignorado):", e);
        }
    });
};
