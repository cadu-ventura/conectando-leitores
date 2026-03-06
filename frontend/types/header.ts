// /src/types/header.ts
import type { RefObject } from 'react';
import type { User, ModalView } from '@/types'; // Importando outros tipos necessários

/**
 * Props para o componente FilterMenu, que é parte do Header.
 */
export interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
  user: User | null;
}

/**
 * Props para o componente SearchBar.
 */
export interface SearchBarProps {
  user: User | null;
  containerClassName?: string;
}

/**
 * Props para o componente UserMenu, o menu dropdown do usuário.
 */
export interface UserMenuProps {
  user: User;
  logout: () => Promise<void>;
  onClose: () => void;
}

/**
 * Props para o componente UserActions, que decide se mostra
 * os botões de login ou o menu do usuário.
 */
export interface UserActionsProps {
  isLoading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  openModal: (view: ModalView) => void;
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
}
