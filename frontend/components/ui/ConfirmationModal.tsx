import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Sim',
  cancelText = 'Não',
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={clsx(
            'fixed',
            'inset-0',
            'bg-black/50',
            'flex',
            'justify-center',
            'items-center',
            'z-50',
            'p-4',
          )}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={clsx(
              'bg-white',
              'rounded-lg',
              'shadow-xl',
              'p-4',
              'w-full',
              'max-w-sm',
            )}
          >
            <h3 className={clsx('text-base', 'font-bold', 'text-tertiary')}>
              {title}
            </h3>
            <p
              className={clsx('text-title-color', 'mt-4', 'mb-6', 'text-base')}
            >
              {message}
            </p>
            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={onConfirm}
                className={clsx(
                  'py-2.5',
                  'px-9',
                  'border',
                  'border-primary',
                  'rounded-lg',
                  'text-primary',
                  'hover:bg-gray-50',
                  'hover:cursor-pointer'
                )}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className={clsx(
                  'py-2.5',
                  'px-9',
                  'bg-purple-600',
                  'text-white',
                  'rounded-lg',
                  'text-base',
                  'hover:bg-purple-700',
                  'hover:cursor-pointer'
                )}
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
