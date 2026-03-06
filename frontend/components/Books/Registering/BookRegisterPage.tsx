'use client'
import React from 'react';
import { useModal } from '@/hooks/useModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { RegisterSucess } from '@/components/ui/RegisterSucess';
import { AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import { redirect } from 'next/navigation';
import BookRegisterForm from './BookRegisterForm';

export default function BookRegisterPage({
    token,
    user
}: {
    token: string;
    user: { isAdmin: boolean };
}) {
    const {
        confirmModal,
        setConfirmModal,
        registerSucess,
        setRegisterSucess,
        handleCancel,
        loading,
        setLoading,
        isAdmin
    } = useModal();

    return (
        <section className="flex flex-col items-center min-h-screen px-4 md:px-0">
            <div className="text-center mt-5 mb-5">
                <h1 className="text-primary text-2xl sm:text-3xl font-bold">
                    Cadastrar Livro
                </h1>
                <p className="mt-3 text-sm md:text-base">
                    Adicione um livro diretamente ao acervo da biblioteca
                </p>
            </div>
            <div className="flex flex-col w-full md:w-1/2 p-5 md:bg-white md:rounded-xl md:shadow-2xl">
                {loading ?
                    <div className='flex justify-center items-center min-h-screen'>
                        <Loader />
                    </div>
                    :
                    <BookRegisterForm
                        token={token}
                        handleCancel={handleCancel}
                        setRegisterSucess={setRegisterSucess}
                        setLoading={setLoading}
                        isAdmin={user.isAdmin}
                    />}
            </div>
            {/* Modal de Cancelar */}
            {confirmModal && (
                <ConfirmationModal
                    isOpen={confirmModal}
                    message="Você tem certeza que quer cancelar o cadastro? Os dados inseridos serão perdidos"
                    onCancel={() => setConfirmModal(false)}
                    onConfirm={() => redirect('/')}
                    title="Confirmação"
                />
            )}
            {/* Modal de Confirmação de Registro */}
            <AnimatePresence>
                {registerSucess && (
                    <RegisterSucess
                        setRegisterSucess={setRegisterSucess}
                        congratulations="Livro cadastrado com sucesso!"
                        text={`${!isAdmin ? 'Aguardando análise do administrador' : ''}`}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}