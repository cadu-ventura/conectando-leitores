'use client'
import AdminRegisterForm from '@/components/NewAdmin/AdminRegisterForm';
import React from 'react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { RegisterSucess } from '@/components/ui/RegisterSucess';
import { AnimatePresence } from 'framer-motion';
import { useModal } from '@/hooks/useModal';
import Loader from '@/components/ui/Loader';
import { redirect } from 'next/navigation';

export default function AdminRegisterPage({ token }: { token: string }) {
    const {
        confirmModal,
        setConfirmModal,
        registerSucess,
        setRegisterSucess,
        handleCancel,
        loading,
        setLoading,
    } = useModal();

    return (
        <section className="flex flex-col items-center min-h-screen px-4 md:px-0">
            <div className='text-center mt-8 mb-6'>
                <h1 className='text-primary text-2xl sm:text-3xl font-bold'>
                    Cadastrar Administradores
                </h1>
            </div>

            <div className="flex flex-col w-full md:w-1/2 px-5 md:py-8 md:bg-white md:rounded-xl md:shadow-2xl">
                {loading ?
                    <div className='flex justify-center items-center min-h-screen'>
                        <Loader />
                    </div>
                    :
                    <AdminRegisterForm
                        token={token}
                        setRegisterSucess={setRegisterSucess}
                        handleCancel={handleCancel}
                        setLoading={setLoading}
                    />}
            </div>
            {/* Modal de Cancelar */}
            {confirmModal && (
                <ConfirmationModal
                    isOpen={confirmModal}
                    message='Você tem certeza que quer cancelar o cadastro? Os dados inseridos serão perdidos'
                    onCancel={() => setConfirmModal(false)}
                    onConfirm={() => redirect('/')}
                    title='Confirmação'
                />
            )}
            {/* Modal de Sucesso */}
            <AnimatePresence>
                {registerSucess && (
                    <RegisterSucess
                        setRegisterSucess={setRegisterSucess}
                        congratulations='Parabéns!'
                        text='Cadastro realizado com sucesso.'
                    />
                )}
            </AnimatePresence>
        </section>
    );
}