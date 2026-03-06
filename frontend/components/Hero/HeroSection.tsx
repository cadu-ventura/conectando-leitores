import { TrendingUp } from "lucide-react";
import Image from "next/image";

type HeroProps = {
    titulo: string;
    subtitulo: string[];
    categoria: string;
    capa: string;
};

export function HeroSection({ titulo, subtitulo, categoria, capa }: HeroProps) {
    return (
        <section className="mb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-gradient-to-r from-primary to-[#400258] text-primary-foreground rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 overflow-visible">
                    <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                        {/* Conteúdo do texto */}
                        <div className="flex-1 max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground mb-4 sm:mb-6">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                                <span className="text-xs sm:text-sm font-medium">
                                    {categoria}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                                Leia o top 01 da semana:{" "}
                                <span className="text-white">{titulo}</span>
                            </h1>

                            <div className="space-y-4 text-sm sm:text-base lg:text-lg text-primary-foreground/90 leading-relaxed">
                                {subtitulo.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>

                        {/* Capa do livro */}
                        <div className="hidden md:block w-full max-w-[340px] relative">
                            <Image
                                src={capa}
                                alt={titulo}
                                width={1080}
                                height={1350}
                                className="w-full h-auto rounded-lg relative translate-y-0 z-0 transform -rotate-y-10 scale-125"
                                unoptimized={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
