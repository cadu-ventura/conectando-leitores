import ContactForm from '@/components/ContactForm/ContactForm.client';
import clsx from 'clsx';

export default function ContatoPage() {
  return (
    <main
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-[calc(100vh-200px)]',
        'py-12',
        'px-4',
        'bg-gray-50',
      )}
    >
      {' '}
      <section className={clsx('text-center', 'mb-8', 'max-w-2xl')}>
        <h1
          className={clsx('text-primary', 'text-4xl', 'font-extrabold', 'mb-3')}
        >
          Fale Conosco
        </h1>
        <p className={clsx('text-gray-600', 'text-lg', 'leading-relaxed')}>
          Precisa de ajuda? Envie sua mensagem e retornaremos o mais <br />
          rápido possível.
        </p>
      </section>
      <ContactForm />
    </main>
  );
}
