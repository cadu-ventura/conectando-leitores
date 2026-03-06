'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // O useAuth agora tem tudo
import type { ModalView, User } from '@/types';

interface UseHeaderReturn {
  user: User | null;
  isLoading: boolean;
  // Renomeie para refletir que vêm do AuthContext
  isAuthModalOpen: boolean;
  authModalView: ModalView;
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
  openAuthModal: (view: ModalView) => void;
  closeAuthModal: () => void;
  handleLogout: () => Promise<void>;
}

export const useHeader = (initialUser: User | null): UseHeaderReturn => {
  // --- REMOVA o estado do modal מכאן ---
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalInitialView, setModalInitialView] = useState<ModalView>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // --- PEGUE O ESTADO E FUNÇÕES DO useAuth() ---
  const {
    user: contextUser,
    logout,
    isLoading,
    isAuthModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  // Lógica do usuário (corrigida anteriormente)
  const user = isLoading ? initialUser : contextUser;

  // --- REMOVA as funções do modal מכאן ---
  const toggleUserMenu = () => setIsUserMenuOpen(prev => !prev);
  // const openModal = ...
  // const closeModal = ...

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  // --- RETORNE os valores do Contexto ---
  return {
    user,
    isLoading,
    isAuthModalOpen, // Nome novo
    authModalView, // Nome novo
    isUserMenuOpen,
    toggleUserMenu,
    openAuthModal, // Do contexto
    closeAuthModal, // Do contexto
    handleLogout,
  };
};
