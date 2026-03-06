'use client';

import { useState, useEffect } from 'react';

/**
 * Hook customizado para verificar se uma media query corresponde ao tamanho da janela.
 * É seguro para uso em SSR (Server-Side Rendering) como no Next.js.
 * @param query A string da media query (ex: '(min-width: 1024px)')
 * @returns `true` se a query corresponder, `false` caso contrário.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Garante que o código só rode no cliente, onde `window` existe.
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);

      // Atualiza o estado se a correspondência mudar
      const listener = () => {
        setMatches(media.matches);
      };

      // Chama o listener uma vez para definir o estado inicial no cliente
      listener();

      // Adiciona o event listener para futuras mudanças (ex: redimensionamento da tela)
      media.addEventListener('change', listener);

      // Função de limpeza para remover o listener quando o componente for desmontado
      return () => media.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
};
