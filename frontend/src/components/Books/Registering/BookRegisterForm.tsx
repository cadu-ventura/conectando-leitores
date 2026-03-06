'use client'
import React from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { useRegisterBookForm } from '@/hooks/useBookRegisterForm';
import { BookRegisterFormProps } from '@/types/bookRegister';
import IsAdmin from '../IsAdmin';
import { Button } from '@/components/ui/button';

export default function BookRegisterForm({
  handleCancel,
  setRegisterSucess,
  setLoading,
  token,
  isAdmin // recebido do server
}: BookRegisterFormProps & { token: string; isAdmin: boolean }) {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    fileName,
    coverName,
    categoryValue,
    setCategoryValue,
    items,
    handleFileChange,
    handleCoverChange,
    onSubmit,
    isDraggingCover,
    setIsDraggingCover,
    isDraggingFile,
    setIsDraggingFile,
    handleDragOver,
    handleDropCover,
    handleDropFile,
  } = useRegisterBookForm(setRegisterSucess, setLoading, token);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col space-y-4 px-2 sm:px-5 md:px-10 lg:px-15 py-5'
      >
        <div className='flex flex-col'>
          <label htmlFor='book-title'>Título do Livro*</label>
          <input
            id='book-title'
            {...register('title')}
            className={`w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 text-gray-500 focus:outline-none text-sm md:text-md ${errors.title
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary'
              }`}
            placeholder='Digite o título do livro'
          />
          {errors.title && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.title.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <label htmlFor='book-author'>Autor*</label>
          <input
            id='book-author'
            {...register('author')}
            className={`w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 text-gray-500 focus:outline-none text-sm md:text-md ${errors.author
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary'
              }`}
            placeholder='Nome do autor'
          />
          {errors.author && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.author.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <label htmlFor='book-category'>Categoria*</label>
          <select
            id='book-category'
            {...register('category')}
            value={categoryValue}
            onChange={e => {
              setCategoryValue(e.target.value);
              setValue('category', e.target.value, { shouldValidate: true }); // força a validação ao mudar o valor
            }}
            className={`w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:outline-none text-sm md:text-md hover:cursor-pointer
                        ${errors.category ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'}
                        ${categoryValue === '' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <option value='' disabled className='hidden'>
              Selecione uma categoria
            </option>
            {items.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.category.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <label htmlFor='book-description'>Descrição*</label>
          <textarea
            id='book-description'
            {...register('description')}
            className={`w-full h-30 pt-2 pb-0 px-2 text-left border-2 border-gray-300 rounded-md focus:ring-2 resize-none focus:outline-none text-gray-500 text-sm md:text-md ${errors.description
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary'
              }`}
            placeholder='Descreva o livro (máximo 500 caracteres)'
          />
          {errors.description && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.description.message}
            </p>
          )}
        </div>

        <div className='flex flex-col '>
          <input
            type='file'
            id='book-cover-upload'
            className='hidden'
            accept='image/png, image/jpeg, image/jpg'
            onChange={handleCoverChange}
          />
          <label
            htmlFor='book-cover-upload'
            className='w-full'
            onDragOver={handleDragOver}
            onDragEnter={() => setIsDraggingCover(true)}
            onDragLeave={() => setIsDraggingCover(false)}
            onDrop={handleDropCover}
          >
            Upload da capa do livro (Opcional)
            {!coverName ? (
              <div
                className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition space-y-2
            ${isDraggingCover ? 'bg-blue-100 border-blue-400' : 'border-gray-400 hover:bg-accent'}`}
              >
                {/* eslint-disable jsx-a11y/alt-text */}
                <Image className='text-primary w-6 h-6' />
                <span className='text-primary font-bold'>
                  Clique aqui para enviar
                </span>
                <span className='text-gray-600 text-xs md:text-sm px-5'>
                  ou arraste a imagem da capa (JPEG, JPG ou PNG, máx. 5MB)
                </span>
              </div>
            ) : (
              <div className='w-full h-32 border-2 border-dashed border-gray-400 px-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition space-y-2'>
                <FileText className='text-[#39BE05] w-6 h-6' />
                <div className='flex flex-col items-center'>
                  <p className='mt-2 text-md text-[#39BE05]'>
                    Capa {coverName}
                  </p>
                  <p>Clique ou arraste para trocar o arquivo</p>
                </div>
              </div>
            )}
          </label>
          {errors.cover && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.cover.message}
            </p>
          )}
        </div>

        {/* Upload do arquivo do livro */}
        <div className='flex flex-col'>
          <input
            type='file'
            id='file-upload'
            className='hidden'
            accept='.pdf, .epub'
            onChange={handleFileChange}
          />
          <label
            htmlFor='file-upload'
            className='w-full'
            onDragOver={handleDragOver}
            onDragEnter={() => setIsDraggingFile(true)}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleDropFile}
          >
            Upload do arquivo do livro*
            {!fileName ? (
              <div
                className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition space-y-2
            ${isDraggingFile ? 'bg-blue-100 border-blue-400' : 'border-gray-400 hover:bg-accent'}`}
              >
                <Upload className='text-primary w-6 h-6' />
                <span className='text-primary font-bold'>
                  Clique aqui para enviar
                </span>
                <span className='text-gray-600 text-xs md:text-sm px-5'>
                  ou arraste o arquivo (PDF ou EPUB, máx. 50MB)
                </span>
              </div>
            ) : (
              <div className='w-full h-32 border-2 border-dashed border-gray-400 px-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition space-y-2'>
                <FileText className='text-[#39BE05] w-6 h-6' />
                <div className='flex flex-col items-center'>
                  <p className='mt-2 text-md text-[#39BE05]'>
                    Livro {fileName}
                  </p>
                  <p>Clique ou arraste para trocar o arquivo</p>
                </div>
              </div>
            )}
          </label>
          {errors.book && (
            <p className='text-error text-xs md:text-sm mt-1'>
              {errors.book.message}
            </p>
          )}
        </div>
        {/*Privilegio de Admin */}
        {isAdmin && <IsAdmin />}
        <div className='w-full flex justify-center space-x-5 px-3 md:space-x-10 md:px-6 mt-5 '>
          <Button
            type='button'
            variant='ghost'
            onClick={handleCancel}
            className='w-1/2 hover:cursor-pointer border border-primary rounded-lg text-primary hover:bg-gray-50'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='default'
            className='w-1/2 hover:cursor-pointer'
          >
            Cadastrar Livro
          </Button>
        </div>
      </form>
    </>
  );
}