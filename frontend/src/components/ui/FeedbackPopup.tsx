// components/ui/FeedbackPopup.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
// REMOVA a importação dos ícones
// import { CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useEffect } from 'react';

interface FeedbackPopupProps {
  status: 'success' | 'error' | 'idle';
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function FeedbackPopup({
  status,
  title,
  message,
  onClose,
  duration = 3000,
}: FeedbackPopupProps) {
  useEffect(() => {
    if (status !== 'idle') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [status, duration, onClose]);

  return (
    <AnimatePresence>
      {(status === 'success' || status === 'error') && (
        // Overlay (fundo cinza transparente)
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          {/* Caixa do Pop-up */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={clsx(
              'w-full max-w-sm rounded-xl bg-white p-6 text-left shadow-lg', // REMOVIDO: border. ALTERADO: text-center para text-left, shadow-xl para shadow-lg
              // Não precisamos mais das bordas coloridas
            )}
          >
            {/* Título */}
            <h3
              className={clsx(
                'mb-2 text-lg font-bold', // Ajustado tamanho e margem
                status === 'success' ? 'text-green-600' : 'text-red-600', // Cores do título
                // REMOVIDO: flex, items-center, justify-center, gap-2
              )}
            >
              {/* REMOVIDOS os ícones */}
              {title}
            </h3>
            {/* Mensagem */}
            <p className="text-sm text-gray-600">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
