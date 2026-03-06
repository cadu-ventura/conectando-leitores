import React from 'react'
import { ShieldUser } from "lucide-react";

const IsAdmin = () => {
  return (
    <section className='border-2 border-gray-300 rounded-md py-3 px-4 sm:px-6 flex sm:flex-row items-start gap-4 sm:gap-5'>
      
      <div className='text-primary flex items-center font-bold'>
        <ShieldUser className='w-6 h-6' />
      </div>

      <div className='w-full sm:w-auto'>
        <h2 className='text-primary font-bold text-sm sm:text-base'>
          Privilégio de Administrador
        </h2>
        <p className='text-xs sm:text-sm'>
          Este livro será imediatamente disponibilizado no acervo sem necessidade de aprovação
        </p>
      </div>
    </section>
  )
}

export default IsAdmin