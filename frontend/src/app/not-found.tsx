import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

export default function NotFound() {
  return (
    <main
      className={clsx(
        'relative',
        'flex',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'text-center',
        'pt-32',
        'lg:pt-25',
      )}
    >
      <div
        className={clsx('absolute', 'top-23', 'lg:top-0', 'w-full', 'z-0')}
        aria-hidden='true'
      >
        <div
          className={clsx(
            'flex',
            'justify-center',
            'font-bold',
            'leading-none',
            'text-transparent',
            'bg-clip-text',
            'bg-gradient-to-b',
            'from-primary/20',
            'to-white',
            'text-[16rem]',
            'md:text-[28rem]',
            'lg:text-[36rem]',
          )}
        >
          404
        </div>
      </div>

      <div className={clsx('z-10', 'flex', 'flex-col', 'items-center')}>
        <div className={clsx('mb-12', 'rounded-full', 'lg:mb-16')}>
          <Image
            src='/detective.png'
            alt='Ilustração de detetive investigando'
            width={366}
            height={366}
            className={clsx('h-auto', 'w-56', 'md:w-80', 'lg:w-[366px]')}
          />
        </div>

        <h1
          className={clsx(
            'text-2xl',
            'font-extrabold',
            'text-primary',
            'sm:text-3xl',
            'md:text-4xl',
          )}
        >
          Hmm... essa página sumiu sem deixar pistas.
        </h1>

        <p
          className={clsx(
            'mt-4',
            'max-w-xl',
            'text-base',
            'text-tertiary',
            'md:text-lg',
          )}
        >
          Mas calma, nosso melhor detetive já está investigando o caso! <br />
          Que tal voltar pra página inicial enquanto ele resolve o mistério?
        </p>

        <Link
          href='/'
          className={clsx(
            'mt-8',
            'transform',
            'rounded-lg',
            'bg-primary',
            'px-12',
            'py-3',
            'text-white',
            'shadow-lg',
            'transition-all',
            'duration-300',
            'hover:-translate-y-0.5',
            'hover:bg-secondary',
            'hover:shadow-xl',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-violet-500',
            'focus:ring-offset-2',
            'md:px-16',
            'lg:px-20',
          )}
        >
          Página Inicial
        </Link>
      </div>
    </main>
  );
}
