import { useState, useEffect, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Retorna uma função de limpeza para quando o componente for desmontado
    return () => setMounted(false);
  }, []);

  // createPortal só funciona no lado do cliente, por isso a verificação 'mounted'
  // O primeiro argumento é o que renderizar (children), o segundo é onde renderizar.
  return mounted ? createPortal(children, document.body) : null;
}
