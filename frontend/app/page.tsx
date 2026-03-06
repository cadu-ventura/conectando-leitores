import { Suspense } from "react";
import { HeroSection } from "@/components/Hero/HeroSection";
import SectionLivros from "@/components/Books/SectionLivros";
import HomepageClient from "@/components/Homepage/Homepage.client";
import Loader from "@/components/ui/Loader";
import { BookModalProvider } from "@/contexts/BookModalContext";

const SectionLoader = () => (
    <div className="flex items-center justify-center min-h-[300px]">
        <Loader />
    </div>
);

export default function Home() {
    return (
        <main className="flex-grow overflow-y-auto py-8">
            <BookModalProvider>
                <HeroSection
                    titulo="Orgulho & Preconceito"
                    subtitulo={[
                        "Ama romance de época com encontros inesperados e diálogos afiados? “Orgulho e Preconceito”, de Jane Austen, é a escolha perfeita.",
                        "Na Inglaterra do século XIX, Elizabeth Bennet e o enigmático Sr. Darcy desafiam convenções e descobrem um amor que vence preconceitos.",
                        "Um clássico atemporal que segue top 1 entre os mais lidos, elegante e irresistível.",
                    ]}
                    categoria="Romance"
                    capa="/livro-01.svg"
                />

                <HomepageClient>
                    <Suspense fallback={<SectionLoader />}>
                        <SectionLivros
                            title="Livros mais lidos na semana"
                            type="most-read"
                        />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <SectionLivros
                            title="Recomendados"
                            type="recommended"
                        />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <SectionLivros title="BookTok" type="booktok" />
                    </Suspense>
                </HomepageClient>
            </BookModalProvider>
        </main>
    );
}
