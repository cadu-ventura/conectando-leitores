import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation';
import React from 'react'

export default function EmptyFavorites() {

  return (
    <div className="flex flex-col items-center text-center space-y-4 mt-5 px-4">
      <div
        onClick={() => redirect('/')}
        className="flex justify-center items-center border-4 border-accent-foreground rounded-full
         w-22 h-22 md:w-32 md:h-32 mb-6 cursor-pointer hover:scale-105 transition-transform"
      >
        <Plus className="text-primary" size={48} />
      </div>
      <div className='mt-8'>
        <h2 className="text-sm md:text-lg ">Você ainda não possui obras favoritas</h2>
        <p className="text-sm md:text-lg">
          Explore a biblioteca e adicione suas preferidas!
        </p>
      </div>
    </div>
  )
}