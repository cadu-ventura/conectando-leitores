'use client';
import { UseModalReturn } from '@/types/modal';
import { useState } from 'react';
import { useAuth } from './useAuth';

export const useModal = (): UseModalReturn => {
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [registerSucess, setRegisterSucess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('sysadmin');

  const handleCancel = (): void => {
    setConfirmModal(true);
  };

  return {
    confirmModal,
    setConfirmModal,
    registerSucess,
    setRegisterSucess,
    handleCancel,
    loading,
    setLoading,
    user,
    isAdmin
  };
};
