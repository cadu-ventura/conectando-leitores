'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import { TabButton } from './sub-components';
import { formVariants } from './animations';
import type { ModalView, ViewConfigValue } from '@/types';
import clsx from 'clsx';

const viewConfig: Record<ModalView, ViewConfigValue> = {
  login: { Component: LoginForm, title: 'Acessar sua conta' },
  signup: { Component: SignupForm, title: 'Crie sua conta' },
};

interface AuthFormPanelProps {
  view: ModalView;
  handleViewChange: (newView: ModalView) => void;
  onClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
}

export default function AuthFormPanel({
  view,
  handleViewChange,
  onClose,
  onDirtyChange,
}: AuthFormPanelProps) {
  const { Component } = viewConfig[view] || viewConfig.login;

  return (
    <div className={clsx('flex', 'flex-col', 'flex-grow', 'overflow-hidden')}>
      <div className={clsx('flex-shrink-0', 'px-6', 'sm:px-8', 'pt-4', 'pb-0')}>
        <div className={clsx('flex', 'justify-end')}>
          <button
            id='auth-modal-close-button'
            aria-label='Fechar modal'
            className={clsx('text-gray-400', 'hover:text-gray-600','hover:cursor-pointer')}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div
          className={clsx(
            'relative',
            'p-1',
            'my-4',
            'w-full',
            'bg-bg-color-02',
            'rounded-lg',
            'flex',
            'overflow-hidden',
          )}
        >
          <motion.div
            className={clsx('absolute', 'top-0', 'left-0', 'h-full', 'w-1/2')}
            animate={{ x: view === 'login' ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className={clsx('p-1', 'w-full', 'h-full')}>
              <div
                className={clsx('w-full', 'h-full', 'bg-primary', 'rounded-lg')}
              />
            </div>
          </motion.div>
          <TabButton
            id='auth-modal-signup-tab'
            active={view === 'signup'}
            onClick={() => handleViewChange('signup')}
          >
            Criar conta
          </TabButton>
          <TabButton
            id='auth-modal-login-tab'
            active={view === 'login'}
            onClick={() => handleViewChange('login')}
          >
            Fazer login
          </TabButton>
        </div>
      </div>
      <div
        className={clsx(
          'flex-grow',
          'px-8',
          'pb-8',
          'pt-4',
          'overflow-y-auto',
          '[scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden',
        )}
      >
        <AnimatePresence mode='wait' custom={view === 'login' ? 1 : -1}>
          <motion.div
            key={view}
            custom={view === 'login' ? 1 : -1}
            variants={formVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <Component
              onViewChange={handleViewChange}
              onClose={onClose}
              onDirtyChange={view === 'signup' ? onDirtyChange : () => {}}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
