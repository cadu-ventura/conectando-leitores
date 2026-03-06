"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";

const BookReaderFooter = () => {
    return (
        <footer
            className={clsx(
                "bg-gradient-to-r from-primary to-[#400258]",
                "dark:bg-none dark:bg-[#434343]",
                "py-6 md:py-8",
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-0 text-white">
                <div className="flex items-center gap-2">
                    <Image
                        src="/favicon.svg"
                        alt="Ícone Conectando Leitores"
                        width={58}
                        height={66}
                        priority
                        style={{ filter: "brightness(0) invert(1)" }}
                    />

                    <div className="flex flex-col">
                        <span
                            className={clsx(
                                "font-bold",
                                "text-xs",
                                "uppercase",
                                "text-white",
                                "leading-tight",
                            )}
                        >
                            Conectando
                        </span>
                        <span
                            className={clsx(
                                "font-bold",
                                "text-xs",
                                "uppercase",
                                "text-white",
                                "leading-tight",
                            )}
                        >
                            Leitores
                        </span>
                    </div>
                </div>

                <p className="text-white text-xs md:text-sm text-center md:text-center">
                    &copy; Todos os direitos reservados
                </p>
            </div>
        </footer>
    );
};

export default BookReaderFooter;
